import { useState } from 'react';
import { Button } from './ui/button';
import { Image as ImageIcon, Type, Trash2 } from 'lucide-react';
import type { CommentElement } from '../types';
import { cn } from './ui/utils';

interface CommentSectionProps {
  elements: CommentElement[];
  onElementAdd: (elementData: Omit<CommentElement, 'id'>) => void;
  onElementUpdate: (elementId: string, updates: Partial<CommentElement>) => void;
  onElementDelete: (elementId: string) => void;
}

export function CommentSection({
  elements,
  onElementAdd,
  onElementUpdate,
  onElementDelete,
}: CommentSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddText = () => {
    onElementAdd({
      type: 'text',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 40 },
      rotation: 0,
      z_index: elements.length,
      content: '텍스트를 입력하세요',
      font_size: 14,
      font_family: 'Arial',
      color: '#000000',
    });
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    const imageUrl = prompt('이미지 URL을 입력하세요:');
    if (imageUrl) {
      onElementAdd({
        type: 'image',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 200 },
        rotation: 0,
        z_index: elements.length,
        image_url: imageUrl,
      });
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Comment</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleAddText}>
            <Type className="w-4 h-4 mr-1" />
            텍스트
          </Button>
          <Button size="sm" variant="outline" onClick={handleAddImage}>
            <ImageIcon className="w-4 h-4 mr-1" />
            이미지
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-gray-50">
        {/* Canvas Area */}
        <div className="absolute inset-0 p-4">
          {elements
            .sort((a, b) => a.z_index - b.z_index)
            .map((element) => (
              <div
                key={element.id}
                onClick={() => setSelectedId(element.id)}
                className={cn(
                  'absolute cursor-move',
                  selectedId === element.id && 'ring-2 ring-teal-500'
                )}
                style={{
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: `${element.size.width}px`,
                  height: `${element.size.height}px`,
                  transform: `rotate(${element.rotation}deg)`,
                  zIndex: element.z_index,
                }}
              >
                {element.type === 'text' ? (
                  <div
                    className="w-full h-full flex items-center justify-center bg-white border p-2"
                    style={{
                      fontSize: `${element.font_size}px`,
                      fontFamily: element.font_family,
                      color: element.color,
                    }}
                  >
                    {element.content || '텍스트'}
                  </div>
                ) : (
                  <img
                    src={element.image_url}
                    alt="Comment"
                    className="w-full h-full object-cover"
                  />
                )}

                {selectedId === element.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementDelete(element.id);
                      setSelectedId(null);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* Empty State */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-body-sm text-gray-400">텍스트나 이미지를 추가하세요</p>
          </div>
        )}
      </div>

      {/* Selected Element Properties */}
      {selectedElement && selectedElement.type === 'text' && (
        <div className="p-4 border-t space-y-2">
          <input
            type="text"
            value={selectedElement.content || ''}
            onChange={(e) =>
              onElementUpdate(selectedElement.id, { content: e.target.value })
            }
            placeholder="텍스트 내용"
            className="w-full px-3 py-2 text-body-sm border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={selectedElement.font_size || 14}
              onChange={(e) =>
                onElementUpdate(selectedElement.id, { font_size: Number(e.target.value) })
              }
              className="w-20 px-3 py-2 text-body-sm border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="color"
              value={selectedElement.color || '#000000'}
              onChange={(e) =>
                onElementUpdate(selectedElement.id, { color: e.target.value })
              }
              className="w-12 h-8 border rounded cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
