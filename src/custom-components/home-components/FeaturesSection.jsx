import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";

const features = [
  {
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1500&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    title: "Listing Creation",
    desc: "Professional listings that attract more guests."
  },
  {
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1500&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    title: "Booking Optimization",
    desc: "Maximize occupancy and revenue with smart pricing."
  },
  {
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1500&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    title: "Housekeeping & Linens",
    desc: "Impeccable cleaning and fresh linens for every stay."
  },
  {
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1500&auto=format&fit=crop&q=100&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    title: "Welcome Kits",
    desc: "Delight guests with thoughtful welcome packages."
  }
];

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 text-theme-text">
        What We Offer
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-theme-background border border-theme-border rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="w-60 h-60 mb-4 rounded-xl overflow-hidden">
              <Image
                loader={gcsImageLoader}
                src={f.img}
                alt={f.title}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-semibold text-xl text-theme-text mb-2">
              {f.title}
            </h3>
            <p className="text-theme-secondary text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
