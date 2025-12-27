import React, { useState, useEffect } from "react";
import { BookOpen, FileText, BrainCircuit, X } from "lucide-react";
import { motion } from "framer-motion";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import api from "../../../services/api";
import Card from "../../common/UI/Card";
import Button from "../../common/UI/Button";
import { toast } from "react-hot-toast";

// Vertical Stacking Layout with Collapsible Topics
const getVerticalLayout = (nodes, edges, collapsedUnits) => {
  if (nodes.length === 0) return { nodes, edges };
  
  // Group nodes by level and parent
  const root = nodes.find(n => n.level === 0);
  const units = nodes.filter(n => n.level === 1);
  const topics = nodes.filter(n => n.level === 2);
  
  const positioned = [];
  const visibleEdges = [];
  
  // Root at top center
  if (root) {
    positioned.push({
      ...root,
      position: { x: -100, y: 0 },
      targetPosition: 'top',
      sourcePosition: 'bottom',
    });
  }
  
  // Units stacked vertically on LEFT side
  const UNIT_VERTICAL_GAP = 200;
  const TOPIC_START_X = 350; // Topics on the right side
  const TOPIC_VERTICAL_GAP = 60;
  const TOPIC_HORIZONTAL_GAP = 220;
  const TOPICS_PER_ROW = 2; // Grid layout for topics
  
  units.forEach((unit, unitIndex) => {
    const unitY = 150 + unitIndex * UNIT_VERTICAL_GAP;
    
    positioned.push({
      ...unit,
      position: { x: -100, y: unitY },
      targetPosition: 'left',
      sourcePosition: 'right',
    });
    
    // Add edge from root to unit (always visible)
    const rootEdge = edges.find(e => e.target === unit.id && e.source === root?.id);
    if (rootEdge) {
      visibleEdges.push(rootEdge);
    }
    
    // Show topics only if unit is NOT collapsed
    if (!collapsedUnits.has(unit.id)) {
      const unitTopics = topics.filter(t => t.parentUnit === unit.id);
      
      unitTopics.forEach((topic, topicIndex) => {
        const row = Math.floor(topicIndex / TOPICS_PER_ROW);
        const col = topicIndex % TOPICS_PER_ROW;
        
        positioned.push({
          ...topic,
          position: { 
            x: TOPIC_START_X + col * TOPIC_HORIZONTAL_GAP, 
            y: unitY + row * TOPIC_VERTICAL_GAP 
          },
          targetPosition: 'left',
          sourcePosition: 'right',
        });
        
        // Add edge from unit to topic
        const topicEdge = edges.find(e => e.source === unit.id && e.target === topic.id);
        if (topicEdge) {
          visibleEdges.push(topicEdge);
        }
      });
    }
  });
  
  return { nodes: positioned, edges: visibleEdges };
};

const SyllabusViewer = () => {
  const [syllabi, setSyllabi] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [collapsedUnits, setCollapsedUnits] = useState(new Set());
  const [originalGraphData, setOriginalGraphData] = useState(null);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  useEffect(() => {
    // Auto-generate mindmap when syllabus is selected
    if (selectedSyllabus) {
      handleGenerateMindmap();
    }
  }, [selectedSyllabus]);

  useEffect(() => {
    // Re-layout when collapsedUnits changes
    if (originalGraphData) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getVerticalLayout(
        originalGraphData.nodes,
        originalGraphData.edges,
        collapsedUnits
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [collapsedUnits, originalGraphData]);

  const fetchSyllabus = async () => {
    try {
      const response = await api.get("/syllabus");
      setSyllabi(response.data.data || []);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseSyllabusContent = (subjectName, content) => {
    const distinctNodes = [];
    const distinctEdges = [];
    let nodeIdCounter = 0;

    // Root Node (Subject Name)
    const rootId = `root-${nodeIdCounter++}`;
    distinctNodes.push({
      id: rootId,
      label: subjectName || "Course Syllabus", 
      level: 0
    });

    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    let currentUnitId = null;

    lines.forEach((line) => {
      // Check for "Unit X:" or "Unit X -" 
      if (/^Unit\s+\d+[:\-]/i.test(line)) {
        currentUnitId = `unit-${nodeIdCounter++}`;
        distinctNodes.push({
          id: currentUnitId,
          label: line,
          level: 1
        });
        // Connect Unit to Root
        distinctEdges.push({
          id: `e-${rootId}-${currentUnitId}`,
          source: rootId,
          target: currentUnitId,
        });
      } else if (currentUnitId && line.length > 3) {
        // It's a topic under the current unit
        const topicId = `topic-${nodeIdCounter++}`;
        distinctNodes.push({
          id: topicId,
          label: line, 
          level: 2,
          parentUnit: currentUnitId // Track parent for collapsing
        });
        // Connect Topic to Unit
        distinctEdges.push({
          id: `e-${currentUnitId}-${topicId}`,
          source: currentUnitId,
          target: topicId,
        });
      }
    });

    return { nodes: distinctNodes, edges: distinctEdges };
  };

  const handleNodeClick = (event, node) => {
    // Only handle Unit nodes (level 1)
    if (node.level === 1) {
      setCollapsedUnits(prev => {
        const newSet = new Set(prev);
        if (newSet.has(node.id)) {
          newSet.delete(node.id); // Expand
        } else {
          newSet.add(node.id); // Collapse
        }
        return newSet;
      });
    }
  };

  const processGraphData = (data) => {
    const graphData = data.mindmap || data;
    
    if(!graphData || !graphData.nodes) {
      console.error("Invalid graph data structure:", data);
      toast.error("Could not visualize data");
      return;
    }

    // Beautiful color palettes
    const colors = {
      root: {
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: 'none',
        shadow: '0 10px 20px rgba(102, 126, 234, 0.4)'
      },
      unit: {
        bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#ffffff',
        border: 'none',
        shadow: '0 6px 12px rgba(240, 147, 251, 0.3)',
        cursor: 'pointer' // Indicate clickable
      },
      topic: {
        bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        color: '#2d3748',
        border: '2px solid #fed7aa',
        shadow: '0 3px 6px rgba(251, 146, 60, 0.15)'
      }
    };

    const initialNodes = graphData.nodes.map(node => {
      const colorScheme = node.level === 0 ? colors.root : node.level === 1 ? colors.unit : colors.topic;
      
      return {
        id: String(node.id),
        data: { 
          label: node.level === 1 ? `${node.label} ${collapsedUnits.has(node.id) ? '▶' : '▼'}` : node.label 
        },
        position: { x: 0, y: 0 },
        type: 'default',
        style: { 
          background: colorScheme.bg,
          color: colorScheme.color,
          border: colorScheme.border,
          borderRadius: node.level === 0 ? '16px' : '12px',
          padding: node.level === 2 ? '8px 14px' : node.level === 1 ? '12px 18px' : '14px 20px',
          fontWeight: node.level === 0 ? 'bold' : node.level === 1 ? '600' : '500',
          width: node.level === 0 ? 250 : node.level === 1 ? 280 : 220,
          fontSize: node.level === 0 ? '15px' : node.level === 1 ? '13px' : '11px',
          boxShadow: colorScheme.shadow,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: node.level === 0 ? '50px' : node.level === 1 ? '45px' : '35px',
          maxWidth: node.level === 0 ? '250px' : node.level === 1 ? '280px' : '220px',
          wordWrap: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.4',
          cursor: node.level === 1 ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          letterSpacing: node.level === 0 ? '0.5px' : '0.3px'
        },
        level: node.level,
        parentUnit: node.parentUnit
      };
    });

    let processedEdges = (graphData.edges || []).map((edge, index) => ({
      id: `e${index}`,
      source: String(edge.source),
      target: String(edge.target),
      type: 'smoothstep',
      animated: false,
      style: { 
        stroke: edge.source.includes('root') ? '#667eea' : edge.source.includes('unit') ? '#f093fb' : '#fcb69f',
        strokeWidth: edge.source.includes('root') ? 3 : edge.source.includes('unit') ? 2.5 : 2
      },
    }));

    // Start with all units collapsed for better initial view
    const allUnitIds = initialNodes.filter(n => n.level === 1).map(n => n.id);
    setCollapsedUnits(new Set(allUnitIds));
    
    // Store original data for re-layout on collapse/expand
    setOriginalGraphData({
      nodes: initialNodes,
      edges: processedEdges
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getVerticalLayout(
      initialNodes,
      processedEdges,
      new Set(allUnitIds) // Start collapsed
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  const handleGenerateMindmap = async () => {
    if(!selectedSyllabus) return;
    
    try {
      const subjectName = selectedSyllabus.subject?.courseName || selectedSyllabus.title || "Course";
      
      const { nodes: localNodes, edges: localEdges } = parseSyllabusContent(
        subjectName,
        selectedSyllabus.content
      );

      if(localNodes.length > 5) {
        processGraphData({ nodes: localNodes, edges: localEdges });
      }
    } catch (err) {
      console.error("Mindmap generation failed", err);
      toast.error("Failed to generate mindmap");
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {!selectedSyllabus ? (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 mr-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Course Syllabus
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Browse and explore your course materials
              </p>
            </div>
          </div>

          {syllabi.length === 0 ? (
            <Card className="shadow-lg">
              <div className="text-center py-16 px-6">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={40} className="text-slate-400" />
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                  No syllabus available for your courses yet.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Check back later or contact your instructor.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {syllabi.map((syllabus) => (
                <Card
                  key={syllabus._id}
                  className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-md border border-slate-200 dark:border-slate-700"
                  onClick={() => setSelectedSyllabus(syllabus)}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
                        <FileText className="text-indigo-600 dark:text-indigo-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">
                          {syllabus.title}
                        </h3>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                          {syllabus.subject?.courseName || "N/A"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                            {syllabus.subject?.courseCode}
                          </span>
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                            Sem {syllabus.semester}
                          </span>
                        </div>
                        {syllabus.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {syllabus.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedSyllabus(null)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-slate-700 dark:text-slate-200"
          >
            <span className="group-hover:-translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400">←</span>
            <span className="text-slate-700 dark:text-slate-200">Back to All Syllabus</span>
          </button>

          {/* Syllabus Content - Compact Scrollable */}
          <Card className="shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                  <BookOpen className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {selectedSyllabus.subject?.courseName || selectedSyllabus.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md font-medium">
                      {selectedSyllabus.subject?.courseCode}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md font-medium">
                      Semester {selectedSyllabus.semester}
                    </span>
                  </p>
                </div>
              </div>

              {/* Compact Scrollable Content */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl p-6 max-h-[350px] overflow-y-auto border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedSyllabus.content}
                  </pre>
                </div>
              </div>
            </div>
          </Card>

          {/* Mindmap Section - Directly Below */}
          <Card className="shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg shadow-pink-500/30">
                  <BrainCircuit className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Knowledge Graph
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Click on units (▶) to expand topics • Interactive visualization
                  </p>
                </div>
              </div>

              {/* Mindmap Container */}
              <div className="w-full h-[650px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-inner">
                {nodes.length > 0 ? (
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={handleNodeClick}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    minZoom={0.3}
                    maxZoom={1.5}
                    nodesDraggable={true}
                    nodesConnectable={false}
                  >
                    <Background color="#94a3b8" gap={20} size={1} />
                    <Controls className="bg-white dark:bg-slate-800 rounded-xl shadow-lg m-3 border border-slate-200 dark:border-slate-700" />
                    <MiniMap className="bg-white dark:bg-slate-800 rounded-xl shadow-lg m-3 border border-slate-200 dark:border-slate-700" />
                  </ReactFlow>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <BrainCircuit size={40} className="opacity-50" />
                    </div>
                    <p className="font-semibold text-lg">Generating knowledge graph...</p>
                    <p className="text-sm text-slate-400 mt-1">Please wait a moment</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SyllabusViewer;
