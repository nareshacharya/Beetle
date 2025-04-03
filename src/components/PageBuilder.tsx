import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  TextCursorInput,
  MousePointerClick,
  PanelTopClose,
  Trash2,
  ArrowLeft,
} from "lucide-react";

interface ComponentBlock {
  id: number;
  type: string;
  label: string;
}

function SortableItem({
  id,
  children,
  dragHandle,
}: {
  id: number;
  children: React.ReactNode;
  dragHandle?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute top-2 left-2 cursor-grab z-10"
        {...attributes}
        {...listeners}
      >
        {dragHandle || <span>::</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function PageBuilder() {
  const [components, setComponents] = useState<ComponentBlock[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addComponent = (type: string, label: string) => {
    const newComponent = {
      id: nextId,
      type,
      label,
    };
    setComponents([...components, newComponent]);
    setNextId(nextId + 1);
  };

  const deleteComponent = (id: number) => {
    setComponents((components) => components.filter((comp) => comp.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setEditedLabel("");
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = components.findIndex((comp) => comp.id === active.id);
      const newIndex = components.findIndex((comp) => comp.id === over?.id);
      setComponents((components) => arrayMove(components, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const handleSelect = (id: number, label: string) => {
    setSelectedId(id);
    setEditedLabel(label);
  };

  const handleLabelChange = () => {
    setComponents((components) =>
      components.map((comp) =>
        comp.id === selectedId ? { ...comp, label: editedLabel } : comp
      )
    );
    setSelectedId(null);
    setEditedLabel("");
  };

  const renderComponent = (comp: ComponentBlock) => (
    <Card className={selectedId === comp.id ? "border-blue-500 border-2" : ""}>
      <CardContent
        className="p-4"
        onClick={() => handleSelect(comp.id, comp.label)}
      >
        <div className="flex justify-between items-center">
          <strong>{comp.label}</strong>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-700 hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              deleteComponent(comp.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {comp.type === "input" && (
          <Input placeholder="Sample input" className="mt-2" />
        )}
        {comp.type === "button" && <Button className="mt-2">Click Me</Button>}
        {comp.type === "heading" && (
          <h2 className="text-xl font-bold mt-2">Page Heading</h2>
        )}
        {comp.type === "text" && (
          <p className="mt-2">This is a paragraph of text you can edit.</p>
        )}

        {comp.type === "divider" && (
          <hr className="my-4 border-t border-gray-300" />
        )}
        {comp.type === "spacer" && <div className="my-6" />}
        {comp.type === "link" && (
          <a href="#" className="text-blue-600 underline mt-2 inline-block">
            Sample Link
          </a>
        )}
        {comp.type === "list" && (
          <ul className="list-disc list-inside mt-2">
            <li>Item one</li>
            <li>Item two</li>
          </ul>
        )}
        {comp.type === "quote" && (
          <blockquote className="mt-2 italic border-l-4 pl-4 border-gray-400 text-gray-600">
            This is a blockquote.
          </blockquote>
        )}
        {comp.type === "code" && (
          <pre className="bg-gray-100 text-sm p-3 rounded mt-2 overflow-auto">
            console.log('Hello, world!')
          </pre>
        )}
        {comp.type === "video" && (
          <div className="mt-2">
            <video controls className="rounded w-full max-w-md">
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        {comp.type === "buttonlink" && (
          <a
            href="#"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Click Me
          </a>
        )}
        {comp.type === "card" && (
          <div className="mt-2">This is a placeholder card content.</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 grid gap-6 grid-cols-[340px_1fr] max-w-screen-xl mx-auto">
      <div className="bg-gradient-to-b from-gray-800 to-gray-700 text-white p-4 rounded shadow-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo-light.svg" alt="Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold">Beetle</h1>
          </div>
          <Link to="/" className="text-white hover:text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <h2 className="text-lg font-semibold mb-4 text-white">Components</h2>
        <div className="grid gap-4 grid-cols-3">
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("input", "Input Field")}
          >
            <TextCursorInput className="w-6 h-6 text-gray-400" />
            <span>Input</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("button", "Submit Button")}
          >
            <MousePointerClick className="w-6 h-6 text-gray-400" />
            <span>Button</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("card", "Info Card")}
          >
            <PanelTopClose className="w-6 h-6 text-gray-400" />
            <span>Card</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("heading", "Page Heading")}
          >
            <strong className="text-lg text-gray-400">H</strong>
            <span>Heading</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("text", "Paragraph Text")}
          >
            <span className="text-lg text-gray-400">T</span>
            <span>Text</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("image", "Image")}
          >
            <span className="text-lg text-gray-400">🖼️</span>
            <span>Image</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("spacer", "Spacer")}
          >
            <span className="text-lg text-gray-400">⬜</span>
            <span>Spacer</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("link", "Link")}
          >
            <span className="text-lg">🔗</span>
            <span>Link</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("list", "List")}
          >
            <span className="text-lg">• • •</span>
            <span>List</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("quote", "Quote")}
          >
            <span className="text-lg">❝</span>
            <span>Quote</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("code", "Code Block")}
          >
            <span className="text-lg">{`</>`}</span>
            <span>Code</span>
          </div>
          <div
            className="border rounded-lg p-4 flex flex-col items-center gap-2 text-sm cursor-pointer hover:shadow-sm bg-gray-700 text-gray-200"
            onClick={() => addComponent("video", "Video")}
          >
            <span className="text-lg">🎥</span>
            <span>Video</span>
          </div>
        </div>
      </div>

      <div>
        {selectedId !== null && (
          <div className="bg-gray-100 p-4 rounded shadow-md mb-6">
            <h2 className="font-semibold mb-2">Edit Component</h2>
            <Input
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              placeholder="Edit label"
              className="mb-2"
            />
            <Button size="sm" onClick={handleLabelChange}>
              Save
            </Button>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={components.map((comp) => comp.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4 grid-cols-3">
              {components.map((comp) => (
                <SortableItem key={comp.id} id={comp.id}>
                  {renderComponent(comp)}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId != null &&
              renderComponent(components.find((comp) => comp.id === activeId)!)}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
