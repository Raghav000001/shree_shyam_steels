import Image from "next/image";
import { ClipboardCheck, Settings, Factory, ShieldCheck, type LucideIcon } from "lucide-react";

interface Step {
  step: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    step: "STEP 1",
    title: "Requirement Review",
    description:
      "We understand the component drawing, material specifications, quantity and quality requirements.",
    image:
      "https://images.pexels.com/photos/19895882/pexels-photo-19895882.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: ClipboardCheck,
  },
  {
    step: "STEP 2",
    title: "Process Planning",
    description:
      "Our engineering team develops the machining process, selects tools, fixtures and inspection methods to ensure precision manufacturing.",
    image:
      "https://images.pexels.com/photos/19895919/pexels-photo-19895919.jpeg?auto=compress&cs=tinysrgb&w=1200",
    icon: Settings,
  },
  {
    step: "STEP 3",
    title: "CNC Production",
    description:
      "Components are manufactured on advanced CNC machines with strict process control and quality monitoring.",
    image:
      "https://images.unsplash.com/photo-1666618090858-fbcee636bd3e?auto=format&fit=crop&w=1200&q=80",
    icon: Factory,
  },
  {
    step: "STEP 4",
    title: "Inspection & Delivery",
    description:
      "Finished components undergo final inspection, packing and timely dispatch to ensure customer satisfaction.",
    image:
      "/images/step4.webp",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-12 flex flex-col items-center text-center sm:mb-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-blue-800 sm:w-10" aria-hidden="true" />
            <span className="text-xs font-bold tracking-widest text-blue-800 sm:text-sm">
              WORK PROCESS
            </span>
            <span className="h-px w-8 bg-blue-800 sm:w-10" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-0">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group flex h-full flex-col rounded-2xl bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* Image with overlapping icon */}
                <div className="relative px-1 pt-1">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Circular floating icon */}
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-300 ease-out group-hover:scale-110">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-800/10">
                        <Icon className="h-6 w-6 text-blue-800" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex flex-1 flex-col items-center px-6 pb-8 pt-11 text-center">
                  <span className="mb-1.5 text-xs font-bold tracking-widest text-blue-800">
                    {item.step}
                  </span>
                  <h3 className="mb-2.5 text-lg font-bold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}