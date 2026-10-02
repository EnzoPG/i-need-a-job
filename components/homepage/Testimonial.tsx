import Image from "next/image";

type Props = {
  className?: string;
};

export function Testimonial({ className = "" }: Props) {
  return (
    <section className={`w-full py-12 sm:py-16 bg-diagonal-stripes ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-surface border border-border p-10 sm:p-16 text-center">
          <span className="text-accent text-xs font-semibold tracking-widest uppercase mb-6 inline-block">
            SUCCESS STORIES
          </span>

          <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-text-primary max-w-3xl mx-auto leading-relaxed">
            &ldquo;I used to spend my evenings copy-pasting resumes. Now I open my
            dashboard to see interviews waiting. It feels like cheating. Had 3
            offers on the table simultaneously.&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Image
              src="/images/user-icon.png"
              alt="Tom Wilson"
              width={44}
              height={44}
              className="w-11 h-11 rounded-lg object-cover border border-border-light"
            />
            <div className="text-left">
              <div className="text-sm font-semibold text-text-primary">
                Tom Wilson
              </div>
              <div className="text-xs text-text-secondary">
                Junior Developer
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
