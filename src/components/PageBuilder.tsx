import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { LexicalEditor } from "@/components/editor";

interface ComponentItem {
  id: string;
  type: string;
  label: string;
  content?: string;
  href?: string;
}

export default function PageBuilder({
  stepId,
}: {
  stepId: string | undefined;
}) {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`step-ui-${stepId}`);
    if (saved) {
      setComponents(JSON.parse(saved));
    }
  }, [stepId]);

  useEffect(() => {
    localStorage.setItem(`step-ui-${stepId}`, JSON.stringify(components));
  }, [components, stepId]);

  const sensors = useSensors(useSensor(PointerSensor));

  const addComponent = (type: string, label: string) => {
    setComponents((prev) => [
      ...prev,
      {
        id: uuidv4(),
        type,
        label,
        content: label,
        href: type === "link" ? "#" : undefined,
      },
    ]);
  };

  const updateComponent = (id: string, changes: Partial<ComponentItem>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...changes } : c))
    );
  };

  const removeComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (active.id !== over?.id) {
      const oldIndex = components.findIndex((item) => item.id === active.id);
      const newIndex = components.findIndex((item) => item.id === over?.id);
      setComponents(arrayMove(components, oldIndex, newIndex));
    }
  };

  const activeItem = components.find((c) => c.id === activeId);

  return (
    <div
      className="border border-dashed border-gray-400 bg-white rounded min-h-[300px] p-4 relative"
      data-pb-target="true"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const type = e.dataTransfer.getData("component/type");
        const label = e.dataTransfer.getData("component/label") || type;
        if (type) addComponent(type, label);
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {components.map((item) => (
            <SortableItem
              key={item.id}
              {...item}
              onDelete={() => removeComponent(item.id)}
              onChange={(changes) => updateComponent(item.id, changes)}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className="border rounded p-4 bg-blue-100 text-gray-900 shadow-md">
              <strong>{activeItem.label}</strong>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function SortableItem({
  id,
  label,
  type,
  content,
  href,
  onDelete,
  onChange,
}: ComponentItem & {
  onDelete: () => void;
  onChange: (changes: Partial<ComponentItem>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const formatRichText = (value: string) => {
    return value
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>");
  };

  const RichTextToolbar = () => (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() => onChange({ content: `**${content || ""}**` })}
        className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Bold
      </button>
      <button
        onClick={() => onChange({ content: `_${content || ""}_` })}
        className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Italic
      </button>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded p-4 bg-gray-50 mb-2 shadow-sm relative group"
    >
      <div
        className="absolute top-2 left-2 cursor-move text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="font-semibold mb-2 ml-6">{label}</div>
      {type === "input" && <Input placeholder="Input field" />}
      {type === "card" && (
        <Card>
          <CardContent>This is a card</CardContent>
        </Card>
      )}
      {type === "heading" && (
        <input
          type="text"
          value={content || ""}
          onChange={(e) => onChange({ content: e.target.value })}
          className="text-lg font-bold w-full bg-transparent outline-none"
        />
      )}
      {type === "list" && (
        <ul className="list-disc ml-5">
          <li>List Item</li>
          <li>Another Item</li>
        </ul>
      )}
      {type === "quote" && (
        <blockquote className="italic border-l-4 pl-4">
          This is a quote block
        </blockquote>
      )}
      {type === "video" && (
        <div className="bg-black text-white p-2">Video Placeholder</div>
      )}
      {type === "link" && (
        <input
          type="text"
          value={content || ""}
          onChange={(e) => onChange({ content: e.target.value })}
          className="text-blue-600 underline bg-transparent outline-none w-full"
        />
      )}
      {type === "button" && <Button>Click Me</Button>}
      {type === "text" && (
        <>
          <RichTextToolbar />
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onChange({ content: e.currentTarget.innerText })}
            dangerouslySetInnerHTML={{ __html: formatRichText(content || "") }}
            className="text-sm text-gray-700 bg-transparent w-full outline-none border border-gray-200 p-2 rounded"
          />
        </>
      )}
      {type === "richtext" && (
        <LexicalEditor onChange={(val) => onChange({ content: val })} />
      )}
    </div>
  );
}
