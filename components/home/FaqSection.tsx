import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/lib/faq";

export function FaqSection() {
  return (
    <section id="vaprosi" className="border-b border-silver bg-warm">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <SectionHeading
          number="04"
          title="Често задавани въпроси"
          description="FAQ — кратки отговори преди да резервирате."
        />
        <div className="mt-8 divide-y divide-silver border border-silver bg-white">
          {faqItems.map((f, index) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                <span className="flex items-start justify-between gap-4">
                  <span>
                    <span className="tabular mr-2 text-steel">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {f.q}
                  </span>
                  <span className="tabular shrink-0 text-steel group-open:hidden">
                    +
                  </span>
                  <span className="tabular hidden shrink-0 text-steel group-open:inline">
                    −
                  </span>
                </span>
              </summary>
              <div className="mt-3 max-w-prose space-y-3 text-sm leading-relaxed text-steel">
                {f.blocks.map((block, i) => {
                  if (block.type === "p") {
                    return <p key={i}>{block.text}</p>;
                  }
                  if (block.type === "ul") {
                    return (
                      <ul key={i} className="space-y-3">
                        {block.items.map((item) => (
                          <li key={item.slice(0, 40)} className="flex gap-2.5">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-accent" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <ul key={i} className="space-y-1.5 border border-silver bg-warm p-3">
                      {block.items.map((ex) => (
                        <li
                          key={ex.label}
                          className="flex items-center justify-between gap-3 text-graphite"
                        >
                          <span>{ex.label}</span>
                          <span
                            className={`tabular text-xs font-medium ${
                              ex.ok ? "text-[#1F7A3A]" : "text-steel"
                            }`}
                          >
                            {ex.ok ? "подхожда" : "не подхожда"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
