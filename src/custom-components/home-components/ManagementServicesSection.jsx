import Link from "next/link";

export default function ManagementServicesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Left Column */}
        <div>
          <h3 className="text-2xl font-bold text-theme-text mb-2">
            If you are looking for an efficient way to manage your hotel
            property, you have come to the right place.
          </h3>
          <p className="text-theme-secondary mb-4 text-base">
            Our team is here to handle the day-to-day operations, leaving you to
            focus on what really matters. From marketing and bookings to
            cleaning and maintenance, we&apos;ve got you covered.
          </p>
          <p className="text-theme-text font-medium">
            Let&apos;s work together to make your hotel a success story
          </p>
        </div>
        {/* Right Column */}
        <div>
          <h3 className="text-2xl font-bold text-theme-text mb-2">
            Our management service ensures that you are able to showcase your
            property in the best light, attract a higher number of guests, and
            maximize your rental revenue.
          </h3>
          <p className="text-theme-secondary mb-2">
            20% commission on revenue generated
          </p>
          <Link
            href="#"
            className="btn-theme-primary inline-block px-6 py-2 rounded-full font-medium transition mb-2"
          >
            Boost your income now <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
      {/* Features Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-theme-success/10 border border-theme-success/20 p-6 flex flex-col items-start shadow">
          <div className="text-xs font-bold text-theme-secondary mb-2">01/</div>
          <div className="text-3xl mb-4">🏷️</div>
          <div className="font-semibold text-lg mb-2 text-theme-text">Listing creation</div>
          <div className="text-theme-secondary text-sm">
            Professional listings that attract more guests.
          </div>
        </div>
        <div className="rounded-2xl bg-theme-primary/10 border border-theme-primary/20 p-6 flex flex-col items-start shadow">
          <div className="text-xs font-bold text-theme-secondary mb-2">02/</div>
          <div className="text-3xl mb-4">🏠</div>
          <div className="font-semibold text-lg mb-2 text-theme-text">Booking optimization</div>
          <div className="text-theme-secondary text-sm">
            Maximize occupancy and revenue with smart pricing.
          </div>
        </div>
        <div className="rounded-2xl bg-theme-warning/10 border border-theme-warning/20 p-6 flex flex-col items-start shadow">
          <div className="text-xs font-bold text-theme-secondary mb-2">03/</div>
          <div className="text-3xl mb-4">🧺</div>
          <div className="font-semibold text-lg mb-2 text-theme-text">
            Housekeeping and hotel linens
          </div>
          <div className="text-theme-secondary text-sm">
            Impeccable cleaning and fresh linens for every stay.
          </div>
        </div>
        <div className="rounded-2xl bg-theme-success/10 border border-theme-success/20 p-6 flex flex-col items-start shadow">
          <div className="text-xs font-bold text-theme-secondary mb-2">04/</div>
          <div className="text-3xl mb-4">🎁</div>
          <div className="font-semibold text-lg mb-2 text-theme-text">Welcome Kits</div>
          <div className="text-theme-secondary text-sm">
            Delight guests with thoughtful welcome packages.
          </div>
        </div>
      </div>
    </section>
  );
}
