import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us - Melodic Instruments</title>
        <meta name="description" content="Learn about Melodic Instruments and our passion for music" />
      </Head>

      {/* Hero */}
      <section className="relative bg-secondary-900 text-white py-24">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920"
            alt="Music studio"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About Melodic</h1>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Bringing quality instruments to musicians worldwide since 2010
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-6">Our Story</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              Melodic Instruments was founded with a simple mission: to make high-quality musical 
              instruments accessible to musicians of all levels. What started as a small shop in 
              Nashville has grown into a trusted online destination for thousands of musicians worldwide.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-4">
              Our team of passionate musicians and industry experts carefully curate each product 
              in our collection, ensuring that whether you're a beginner picking up your first guitar 
              or a professional seeking a concert-grade instrument, you'll find exactly what you need.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              We believe that music has the power to transform lives, and we're committed to helping 
              every musician find their perfect sound.
            </p>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800"
              alt="Music instruments"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Quality First</h3>
              <p className="text-secondary-600">
                We partner with the world's finest instrument makers to bring you products 
                that meet the highest standards of craftsmanship.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Community</h3>
              <p className="text-secondary-600">
                We're more than a store – we're a community of musicians supporting each other 
                on our musical journeys.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Passion</h3>
              <p className="text-secondary-600">
                Every team member at Melodic is a musician who shares your passion for music 
                and understands your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
            <div className="text-secondary-600">Years in Business</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">50k+</div>
            <div className="text-secondary-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-secondary-600">Products</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">4.9</div>
            <div className="text-secondary-600">Average Rating</div>
          </div>
        </div>
      </section>
    </>
  );
}
