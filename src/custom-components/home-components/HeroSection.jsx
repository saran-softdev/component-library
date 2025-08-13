import Image from "next/image";
import gcsImageLoader from "@/lib/gcs-image-loader";
import Link from "next/link";


export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-20">
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 gap-8 md:gap-12">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center order-2 md:order-1">
          <div className="inline-flex items-center gap-2 bg-theme-background text-theme-primary font-medium px-4 py-1.5 rounded-full shadow-sm mb-4 w-fit border border-theme-border">
            <span className="h-2 w-2 bg-theme-primary rounded-full"></span>
            Trusted by 200+ hotels worldwide
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-theme-text">
            Modern Hotel Management <br className="hidden md:block" />
            <span className="text-theme-primary">Made Simple</span>
          </h1>

          <p className="text-lg text-theme-secondary mb-8 max-w-lg">
            Streamline operations, boost revenue, and delight your guests with
            our all-in-one Property Management System designed for modern
            hospitality businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              href="#"
              className="btn-theme-primary inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
            >
              Start Free Trial
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="#"
              className="btn-theme-outline inline-flex items-center justify-center gap-2 font-medium px-8 py-3.5 rounded-lg shadow-sm transition-all"
            >
              Watch Demo
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-theme-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="bg-theme-primary/10 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-theme-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-theme-text">200+</div>
                <div className="text-sm text-theme-secondary">
                  Hotels Worldwide
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-theme-success/10 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-theme-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-theme-text">30%</div>
                <div className="text-sm text-theme-secondary">
                  More Bookings
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex items-center justify-center relative order-1 md:order-2">
          <div className="relative w-full h-[350px] md:h-[480px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              loader={gcsImageLoader}
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D"
              alt="Luxury hotel room with modern design"
              fill
              className="object-cover"
              priority
              quality={90}
            />

            {/* Floating Card */}
            <div className="absolute bottom-6 left-6 bg-theme-background/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs border border-theme-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-theme-primary/10 p-1 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-theme-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-theme-text">
                  Real-time Availability
                </h3>
              </div>
              <p className="text-sm text-theme-secondary">
                Manage room inventory across all channels from one dashboard
              </p>
            </div>

            {/* Chat/help button */}
            <button className="absolute bottom-6 right-6 bg-theme-background hover:bg-theme-surface text-theme-primary rounded-full p-3 shadow-lg transition-all transform hover:scale-105 border border-theme-border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
