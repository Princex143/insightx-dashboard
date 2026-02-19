import type { Widget } from "../types";

type Props = {
  widgets: Widget[];
  onReorder: (fromId: string, toId: string) => void;
};

export function WidgetBoard({ widgets, onReorder }: Props) {
  return (
    <section className="widget-grid">
      {widgets.map((widget) => (
        <article
          key={widget.id}
          className="card widget"
          draggable
          onDragStart={(event) => event.dataTransfer.setData("text/plain", widget.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const fromId = event.dataTransfer.getData("text/plain");
            onReorder(fromId, widget.id);
          }}
        >
          <p className="muted">{widget.type.toUpperCase()}</p>
          <h3>{widget.title}</h3>
          <p className="tiny">Drag cards to reorder your layout</p>
        </article>
      ))}
    </section>
  );
}
