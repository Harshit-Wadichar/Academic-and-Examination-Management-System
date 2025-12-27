import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import Modal from './Modal';
import Button from './Button';
import { Upload, X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import getCroppedImg from '../../../utils/imageUtils';
import { toast } from 'react-hot-toast';
import api from '../../../services/api';

const ImageUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setLoading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append('image', croppedImageBlob, 'profile.jpg');

      const response = await api.post('/users/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Profile picture updated!');
        onUploadSuccess(response.data.imageUrl);
        onClose();
        setImageSrc(null); // Reset
      }
    } catch (error) {
      console.error('Upload failed', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={reset} title="Update Profile Picture" size="lg">
      <div className="space-y-6">
        {!imageSrc ? (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                <Upload size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Click to Upload</h3>
              <p className="text-slate-500 text-sm">SVG, PNG, JPG or GIF (max. 800x800px)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative h-80 w-full bg-slate-900 rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="flex items-center gap-4 px-2">
              <ZoomIn size={20} className="text-slate-500" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="w-full accent-indigo-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
               <Button variant="secondary" onClick={() => setImageSrc(null)}>
                  Change Image
               </Button>
               <Button onClick={handleUpload} loading={loading}>
                  Save & Apply
               </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageUploadModal;
