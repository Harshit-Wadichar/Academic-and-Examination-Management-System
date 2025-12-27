import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Upload, Eye, Download, Plus, Search, BrainCircuit, X, Maximize2, FileText } from "lucide-react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { useAuth } from "../hooks/useAuth";
import { useApi, useApiMutation } from "../hooks/useApi";
import api from "../services/api";
import Card from "../components/common/UI/Card";
import Button from "../components/common/UI/Button";
import Modal from "../components/common/UI/Modal";
import { toast } from "react-hot-toast";

  // Custom Tree Layout Algorithm (Staggered/Compact Pyramid)
const getTreeLayout = (nodes, edges) => {
    if (nodes.length === 0) return { nodes, edges };

    // 1. Build Hierarchy Map
    const hierarchy = {}; // parentId -> [childId, ...]
    
    edges.forEach(e => {
        if (!hierarchy[e.source]) hierarchy[e.source] = [];
        hierarchy[e.source].push(e.target);
    });

    const root = nodes.find(n => n.level === 0);
    if (!root) return { nodes, edges }; // Fallback

    // Configuration
    const Y_SPACING = 140;
    const STAGGER_OFFSET = 70; // Vertical offset for alternate nodes
    // Reduced spacing because we are staggering
    const MIN_NODE_SPACING = 180; 

    // 2. Layout Calculation
    let currentGlobalLeafX = 0;
    const positions = new Map(); // id -> { x, y }

    const computeNodePosition = (nodeId, depth) => {
        const children = hierarchy[nodeId] || [];
        
        if (children.length === 0) {
            // Leaf Node
            const x = currentGlobalLeafX;
            currentGlobalLeafX += MIN_NODE_SPACING; 
            positions.set(nodeId, { x, y: depth * Y_SPACING });
            return { minX: x, maxX: x, x };
        }

        // Parent Node: Process all children
        const childInfos = children.map((childId, index) => {
            // Pass Stagger Info implicitly? No, stagger is applied to Y later or here.
            // Actually, we process X normally, but we can squeeze them because we WILL stagger them.
            return computeNodePosition(childId, depth + 1);
        });
        
        const minChildX = Math.min(...childInfos.map(c => c.x));
        const maxChildX = Math.max(...childInfos.map(c => c.x));
        const x = (minChildX + maxChildX) / 2;

        // Apply Staggering to Children Results
        // We need to re-assign Y for children based on their index in this group
        children.forEach((childId, index) => {
            const pos = positions.get(childId);
            if (pos && index % 2 !== 0) {
               pos.y += STAGGER_OFFSET;
            }
        });

        positions.set(nodeId, { x, y: depth * Y_SPACING });
        
        return { 
            minX: childInfos[0].minX, 
            maxX: childInfos[childInfos.length - 1].maxX, 
            x 
        };
    };

    // Run Layout
    computeNodePosition(root.id, 0);

    // 3. Apply Positions
    const layoutedNodes = nodes.map(node => {
        const pos = positions.get(node.id) || { x: 0, y: 0 };
        return {
            ...node,
            position: pos,
            targetPosition: 'top',
            sourcePosition: 'bottom',
        };
    });

    return { nodes: layoutedNodes, edges };
};

const SyllabusPage = () => {
  const { user } = useAuth();
  const { data: syllabuses, loading, refetch } = useApi("/syllabus");
  const { mutate, loading: uploading } = useApiMutation();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mindmap State
  const [showMindmapModal, setShowMindmapModal] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    content: "",
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    const result = await mutate("post", "/syllabus", formData);
    if (result.success) {
      toast.success("Syllabus uploaded successfully!");
      setShowUploadModal(false);
      setFormData({ title: "", course: "", description: "", content: "" });
      refetch();
    } else {
      toast.error("Failed to upload syllabus");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const parseSyllabusContent = (title, content) => {
      const distinctNodes = [];
      const distinctEdges = [];
      let nodeIdCounter = 0;

      // Root Node (Subject)
      const rootId = `root-${nodeIdCounter++}`;
      distinctNodes.push({
          id: rootId,
          label: title, 
          level: 0
      });

      const lines = content.split('\n').map(l => l.trim()).filter(l => l);
      let currentUnitId = null;

      lines.forEach((line) => {
          // Check for "Unit X" or "Module X"
          if (/^(Unit|Module)\s+\d+[:|.]?/i.test(line)) {
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
          } else if (currentUnitId) {
              // It's a topic under the current unit
              if (line.length > 2) {
                  const topicId = `topic-${nodeIdCounter++}`;
                  distinctNodes.push({
                      id: topicId,
                      label: line, 
                      level: 2
                  });
                  // Connect Topic to Unit
                  distinctEdges.push({
                      id: `e-${currentUnitId}-${topicId}`,
                      source: currentUnitId,
                      target: topicId,
                  });
              }
          }
      });

      return { nodes: distinctNodes, edges: distinctEdges };
  };

  const processGraphData = (data) => {
      // Handle both nested 'mindmap' structure (new) and flat structure (fallback/old)
      const graphData = data.mindmap || data;
      
      if(!graphData || !graphData.nodes) {
        console.error("Invalid graph data structure:", data);
        toast.error("Could not visualize data");
        return;
      }

      const initialNodes = graphData.nodes.map(node => ({
        id: String(node.id),
        data: { label: node.label }, 
        position: { x: 0, y: 0 },
        type: 'default',
        style: { 
            background: node.level === 0 ? '#4f46e5' : node.level === 1 ? '#eef2ff' : '#ffffff',
            color: node.level === 0 ? '#ffffff' : '#334155',
            border: node.level === 0 ? 'none' : '1px solid #cbd5e1',
            borderRadius: '8px', // Smaller radius
            padding: node.level === 2 ? '8px' : '12px', // Tighter padding for topics
            fontWeight: node.level === 0 ? 'bold' : node.level === 1 ? '600' : 'normal',
            width: node.level === 0 ? 200 : node.level === 1 ? 180 : 160, // Fixed widths matching layout
            fontSize: node.level === 0 ? '14px' : node.level === 1 ? '13px' : '11px', // Smaller fonts
            boxShadow: node.level === 0 ? '0 4px 6px -1px rgba(79, 70, 229, 0.2)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40px'
        },
        level: node.level
      }));

      let processedEdges = (graphData.edges || []).map((edge, index) => ({
        id: `e${index}`,
        source: String(edge.source),
        target: String(edge.target),
        type: 'smoothstep', 
        animated: false, // Static edges look cleaner in tight layout
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getTreeLayout(
        initialNodes,
        processedEdges
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
  };

  const { data: examsData } = useApi("/exams");

  const handleGenerateMindmap = async () => {
      if(!selectedSyllabus) return;
      
      // Calculate Exam Context
      let daysRemaining = null;
      let examDate = null;
      
      if (examsData?.data) {
          const courseExams = examsData.data.filter(ex => 
              ex.course.toLowerCase() === selectedSyllabus.course.toLowerCase() && 
              new Date(ex.date) > new Date()
          );
          
          if (courseExams.length > 0) {
              // Sort by nearest date
              courseExams.sort((a, b) => new Date(a.date) - new Date(b.date));
              const nearestExam = courseExams[0];
              examDate = nearestExam.date;
              
              const today = new Date();
              const examDay = new Date(nearestExam.date);
              const diffTime = Math.abs(examDay - today);
              daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
              console.log(`Found Exam Context: ${daysRemaining} days remaining`);
          }
      }

      // 1. Try Local Parsing first (fast & structured)
      try {
           const { nodes: localNodes, edges: localEdges } = parseSyllabusContent(
               selectedSyllabus.title, 
               selectedSyllabus.content
           );

           if(localNodes.length > 5) { // If we found a reasonable structure
                console.log("Using local parser results");
                // IMMEDIATE FIX: Use local data first to ensure graph renders
                processGraphData({ nodes: localNodes, edges: localEdges });
                
                // We will still call AI for enhancements (suggestions), but we won't block the UI
           }
      } catch (err) {
          console.warn("Local parsing failed, falling back to AI", err);
      }

      // 2. AI Service Call (Primary for Suggestions + Graph)
      try {
        toast.loading(daysRemaining ? `Analyzing context (${daysRemaining} days left)...` : 'Generating Knowledge Graph...', { id: 'mindmap' });
        
        const response = await api.post('/ai/generate-mindmap', { 
            syllabusText: selectedSyllabus.content,
            daysRemaining,
            examDate
        });
        
        if(response.data.success && response.data.data) {
            toast.success('Generated with Exam Context!', { id: 'mindmap' });
            processGraphData(response.data.data);
            setAiAnalysis(response.data.data.analysis);
            setShowMindmapModal(true);
        } else {
             toast.error('Failed to parse AI response', { id: 'mindmap' });
        }
      } catch(err) {
        toast.error('AI Service unavailable', { id: 'mindmap' });
        console.error(err);
      }
  };

  const filteredSyllabuses = Array.isArray(syllabuses?.data)
    ? syllabuses.data.filter(
        (syllabus) =>
          syllabus.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          syllabus.course.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8 max-w-7xl mx-auto min-h-screen"
    >


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
             <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Syllabus Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Manage course syllabuses and materials
            </p>
          </div>
        </div>
        {user?.role === "admin" && (
          <Button
            onClick={() => setShowUploadModal(true)}
            icon={<Plus size={18} />}
            className="shadow-lg shadow-primary-500/20"
          >
            Upload Syllabus
          </Button>
        )}
      </div>

      {/* Search */}
      <Card variant="glass" className="border border-white/20 dark:border-slate-700 p-2" noPadding>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search syllabuses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none rounded-xl focus:outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 text-lg"
          />
        </div>
      </Card>

      {/* Syllabus List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-56 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabuses.map((syllabus, index) => (
            <motion.div
              key={syllabus._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/40 dark:border-slate-700 group flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                             <FileText size={24} />
                        </div>
                         <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md uppercase tracking-wider">
                             COURSE
                         </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {syllabus.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
                        {syllabus.course}
                    </p>
                    <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-6 min-h-[4.5rem]">
                        {syllabus.description}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedSyllabus(syllabus)}
                      icon={<Eye size={16} />}
                      className="flex-1 justify-center bg-white dark:bg-transparent"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Download size={16} />}
                      className="w-10 px-0 flex items-center justify-center bg-white dark:bg-transparent"
                    >
                    </Button>
                  </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredSyllabuses.length === 0 && !loading && (
        <Card>
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No syllabuses found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {user?.role === "admin"
                ? "Upload your first syllabus to get started with course management."
                : "No syllabuses have been uploaded for you yet."}
            </p>
            {user?.role === "admin" && (
                <Button onClick={() => setShowUploadModal(true)} className="mt-6">
                    Upload Now
                </Button>
            )}
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      {user?.role === "admin" && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload Syllabus"
        >
          <form onSubmit={handleUpload} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
                placeholder="e.g. Advanced Calculus"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Course</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
                placeholder="e.g. Mathematics 101"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400 resize-none"
                placeholder="Brief description of the syllabus..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-slate-400"
                placeholder="Paste the full syllabus content here..."
              />
            </div>
            <div className="flex space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={() => setShowUploadModal(false)} className="flex-1">Cancel</Button>
              <Button type="submit" loading={uploading} className="flex-1 shadow-lg shadow-primary-500/20">Upload Syllabus</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Details Modal */}
      <Modal
        isOpen={!!selectedSyllabus}
        onClose={() => setSelectedSyllabus(null)}
        title={selectedSyllabus?.title}
        size="lg"
      >
        {selectedSyllabus && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Course</h4>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedSyllabus.course}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Last Updated</h4>
                    <p className="font-semibold text-slate-900 dark:text-white">{new Date(selectedSyllabus.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{selectedSyllabus.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Syllabus Content</h4>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 max-h-80 overflow-y-auto font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 shadow-inner">
                <pre className="whitespace-pre-wrap font-sans">
                  {selectedSyllabus.content}
                </pre>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button 
                variant="secondary" 
                icon={<Download size={18} />} 
                className="flex-1 justify-center"
              >
                Download PDF
              </Button>
              <Button 
                onClick={handleGenerateMindmap}
                icon={<BrainCircuit size={18} />}
                className="flex-[2] justify-center shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white hover:from-indigo-700 hover:to-purple-700"
              >
                Generate Knowledge Graph
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Mindmap Visualization Modal */}
      {showMindmapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-slate-900 w-full h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden max-w-7xl border border-white/20 dark:border-slate-700 ring-1 ring-black/5"
            >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-4 pl-2">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-xl">
                            <BrainCircuit className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Knowledge Graph
                                <span className="text-slate-400 font-normal hidden sm:inline">|</span>
                                <span className="text-base font-medium text-slate-500 hidden sm:inline">{selectedSyllabus?.title}</span>
                            </h3>
                            {aiAnalysis && (
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                                    Complexity Level: <span className="text-indigo-600 dark:text-indigo-400 capitalize">{aiAnalysis.complexity?.complexity_level}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowMindmapModal(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 w-full h-full bg-slate-50 dark:bg-slate-950/50 relative">
                    {nodes.length > 0 ? (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            fitView
                            fitViewOptions={{ padding: 0.2 }}
                            attributionPosition="bottom-right"
                            minZoom={0.5}
                            nodesDraggable={true}
                            nodesConnectable={false}
                        >
                            <Background color="#94a3b8" gap={20} size={1} />
                            <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 fill-slate-600 dark:fill-slate-300 shadow-xl rounded-lg overflow-hidden m-4" />
                            <MiniMap className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xl rounded-lg m-4" />
                        </ReactFlow>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <BrainCircuit size={32} className="opacity-50" />
                            </div>
                            <p className="font-medium">Visualizing data layout...</p>
                        </div>
                    )}
                </div>

                {aiAnalysis && aiAnalysis.suggestions && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-center gap-3 mb-3">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <h4 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">AI Study Suggestions</h4>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {aiAnalysis.suggestions.slice(0, 4).map((s, i) => (
                                <span key={i} className="text-xs font-medium bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SyllabusPage;
