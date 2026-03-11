'use client';

import type { CanvasElement, CanvasAction, ElementStyle } from '@/types/canvas';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  dispatch: React.Dispatch<CanvasAction>;
}

export default function PropertiesPanel({ selectedElement, dispatch }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <aside className="w-64 bg-gray-800 border-l border-gray-700 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Properties
        </h2>
        <p className="text-gray-500 text-sm">Select an element to edit</p>
      </aside>
    );
  }

  const { id, type, position, size, rotation, style } = selectedElement;

  return (
    <aside className="w-64 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Properties
      </h2>

      <div className="space-y-4">
        {/* Element type badge */}
        <div className="text-xs text-gray-400 bg-gray-700 rounded px-2 py-1 inline-block capitalize">
          {type}
        </div>

        {/* Position */}
        <Section title="Position">
          <NumberInput
            label="X"
            value={position.x}
            onChange={(x) =>
              dispatch({ type: 'MOVE_ELEMENT', payload: { id, position: { ...position, x } } })
            }
          />
          <NumberInput
            label="Y"
            value={position.y}
            onChange={(y) =>
              dispatch({ type: 'MOVE_ELEMENT', payload: { id, position: { ...position, y } } })
            }
          />
        </Section>

        {/* Size */}
        <Section title="Size">
          <NumberInput
            label="W"
            value={size.width}
            onChange={(width) =>
              dispatch({ type: 'RESIZE_ELEMENT', payload: { id, size: { ...size, width } } })
            }
          />
          <NumberInput
            label="H"
            value={size.height}
            onChange={(height) =>
              dispatch({ type: 'RESIZE_ELEMENT', payload: { id, size: { ...size, height } } })
            }
          />
        </Section>

        {/* Rotation */}
        <Section title="Rotation">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) =>
                dispatch({
                  type: 'ROTATE_ELEMENT',
                  payload: { id, rotation: Number(e.target.value) },
                })
              }
              className="flex-1 h-1.5 accent-blue-500"
            />
            <input
              type="number"
              value={Math.round(rotation)}
              onChange={(e) =>
                dispatch({
                  type: 'ROTATE_ELEMENT',
                  payload: { id, rotation: Number(e.target.value) % 360 },
                })
              }
              min={0}
              max={360}
              className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            />
          </div>
        </Section>

        {/* Background Color */}
        <Section title="Fill">
          <ColorInput
            value={style.backgroundColor}
            onChange={(backgroundColor) =>
              dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { backgroundColor } } })
            }
          />
        </Section>

        {/* Stroke Width (line only) */}
        {type === 'line' && (
          <Section title="Stroke">
            <NumberInput
              label="Width"
              value={style.strokeWidth ?? 2}
              onChange={(strokeWidth) => {
                dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { strokeWidth } } });
                dispatch({ type: 'RESIZE_ELEMENT', payload: { id, size: { ...size, height: strokeWidth } } });
              }}
              min={1}
              max={50}
            />
          </Section>
        )}

        {/* Border (hidden for triangle and line) */}
        {type !== 'triangle' && type !== 'line' && (
          <Section title="Border">
            <ColorInput
              value={style.borderColor}
              onChange={(borderColor) =>
                dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { borderColor } } })
              }
            />
            <NumberInput
              label="Width"
              value={style.borderWidth}
              onChange={(borderWidth) =>
                dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { borderWidth } } })
              }
              min={0}
              max={20}
            />
            {type !== 'circle' && (
              <NumberInput
                label="Radius"
                value={style.borderRadius}
                onChange={(borderRadius) =>
                  dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { borderRadius } } })
                }
                min={0}
                max={100}
              />
            )}
          </Section>
        )}

        {/* Opacity */}
        <Section title="Opacity">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(style.opacity * 100)}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_STYLE',
                  payload: { id, style: { opacity: Number(e.target.value) / 100 } },
                })
              }
              className="flex-1 h-1.5 accent-blue-500"
            />
            <span className="text-xs text-gray-400 w-8 text-right">
              {Math.round(style.opacity * 100)}
            </span>
          </div>
        </Section>

        {/* Text properties */}
        {type === 'text' && (
          <>
            <Section title="Text">
              <input
                type="text"
                value={selectedElement.text ?? ''}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_TEXT', payload: { id, text: e.target.value } })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              />
            </Section>
            <Section title="Font">
              <NumberInput
                label="Size"
                value={style.fontSize ?? 16}
                onChange={(fontSize) =>
                  dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { fontSize } } })
                }
                min={8}
                max={120}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-10">Family</span>
                <select
                  value={style.fontFamily ?? 'Inter, sans-serif'}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { fontFamily: e.target.value } } })
                  }
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                </select>
              </div>
              <ColorInput
                value={style.color ?? '#000000'}
                onChange={(color) =>
                  dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { color } } })
                }
              />
            </Section>
            <Section title="Alignment">
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() =>
                      dispatch({ type: 'UPDATE_STYLE', payload: { id, style: { textAlign: align } } })
                    }
                    className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                      (style.textAlign ?? 'left') === align
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* Delete button */}
        <button
          onClick={() => dispatch({ type: 'DELETE_ELEMENT', payload: { id } })}
          className="w-full mt-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
        >
          Delete Element
        </button>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs text-gray-500 mb-1.5">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-10">{label}</span>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white w-full"
      />
    </div>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value === 'transparent' ? '#ffffff' : value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-gray-600 bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
      />
    </div>
  );
}
