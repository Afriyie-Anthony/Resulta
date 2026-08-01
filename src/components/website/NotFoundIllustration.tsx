import React from 'react';

const NotFoundIllustration: React.FC = () => {
  return (
    <div
      className="relative w-full max-w-sm mx-auto lg:max-w-md"
      aria-hidden="true"
    >
      <style>{`
        @keyframes ndFloatSlow {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-14px) scale(1.03) rotate(-1deg); }
        }
        @keyframes ndFloatMedium {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-10px) scale(1.02) rotate(1deg); }
        }
        @keyframes ndPulseDot {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.6; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nd-animate-float-slow, .nd-animate-float-medium, .nd-pulse-dot {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
        .nd-animate-float-slow { animation: ndFloatSlow 7s ease-in-out infinite; }
        .nd-animate-float-medium { animation: ndFloatMedium 5.5s ease-in-out infinite; }
        .nd-pulse-dot { animation: ndPulseDot 3s ease-in-out infinite; }
      `}</style>

      {/* Dotted grid backdrop */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.05]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="ndGrid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1" fill="#0F8B8D" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ndGrid)" />
      </svg>

      {/* Floating decorative blobs */}
      <div
        className="absolute top-4 left-2 w-44 h-44 bg-secondary/15 rounded-full blur-3xl nd-animate-float-slow"
        style={{ animationDelay: '0ms' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-6 right-4 w-40 h-40 bg-accent/12 rounded-full blur-3xl nd-animate-float-slow"
        style={{ animationDelay: '800ms' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 left-1/3 w-32 h-32 bg-primary/8 rounded-full blur-2xl nd-animate-float-medium"
        style={{ animationDelay: '400ms' }}
        aria-hidden="true"
      />

      {/* Subtle floating dots */}
      <div
        className="absolute top-10 right-16 w-2 h-2 bg-accent rounded-full nd-pulse-dot"
        style={{ animationDelay: '200ms' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-14 left-12 w-1.5 h-1.5 bg-secondary rounded-full nd-pulse-dot"
        style={{ animationDelay: '1100ms' }}
        aria-hidden="true"
      />

      {/* Lost voucher card */}
      <div
        className="relative mx-auto mt-8 nd-animate-float-medium"
        style={{ animationDelay: '200ms' }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 320 200"
          className="w-full h-auto"
          role="img"
          aria-label="Lost Resulta voucher card"
        >
          <defs>
            <linearGradient
              id="ndCardGrad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#E2B93B" />
              <stop offset="55%" stopColor="#E2B93B" />
              <stop offset="100%" stopColor="#123B5D" />
            </linearGradient>
            <filter
              id="ndShadow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feDropShadow
                dx="0"
                dy="18"
                stdDeviation="16"
                floodColor="#000"
                floodOpacity="0.15"
              />
            </filter>
          </defs>

          {/* Card base */}
          <rect
            x="20"
            y="20"
            width="280"
            height="160"
            rx="22"
            fill="url(#ndCardGrad)"
            stroke="#FFFFFF"
            strokeWidth="1"
            opacity="0.35"
            filter="url(#ndShadow)"
          />

          {/* Top gloss highlight */}
          <rect
            x="20"
            y="20"
            width="280"
            height="40"
            rx="22"
            fill="#FFFFFF"
            opacity="0.18"
          />

          {/* Perforation holes (left edge punch pattern) */}
          <circle cx="26" cy="50" r="3.5" fill="#FFFFFF" opacity="0.25" />
          <circle cx="26" cy="74" r="3.5" fill="#FFFFFF" opacity="0.25" />
          <circle cx="26" cy="98" r="3.5" fill="#FFFFFF" opacity="0.25" />
          <circle cx="26" cy="122" r="3.5" fill="#FFFFFF" opacity="0.25" />
          <circle cx="26" cy="146" r="3.5" fill="#FFFFFF" opacity="0.25" />

          {/* R logo badge + RESULTA label */}
          <rect x="42" y="38" width="24" height="24" rx="6" fill="#FFFFFF" />
          <text
            x="54"
            y="56"
            textAnchor="middle"
            fontWeight="700"
            fontSize="13"
            fontFamily="Manrope, sans-serif"
            fill="#123B5D"
          >
            R
          </text>
          <text
            x="74"
            y="56"
            fontWeight="700"
            fontSize="15"
            fontFamily="Manrope, sans-serif"
            fill="#FFFFFF"
          >
            RESULTA
          </text>

          {/* Magnifying glass - "looking for the missing page" */}
          <g opacity="0.78">
            <circle
              cx="272"
              cy="52"
              r="12"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.6"
            />
            <text
              x="272"
              y="57"
              textAnchor="middle"
              fontWeight="700"
              fontSize="12"
              fontFamily="Manrope, sans-serif"
              fill="#FFFFFF"
            >
              ?
            </text>
            <line
              x1="281"
              y1="60"
              x2="294"
              y2="72"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              opacity="0.55"
            />
          </g>

          {/* Large missing "404" number on card */}
          <text
            x="160"
            y="130"
            textAnchor="middle"
            fontWeight="800"
            fontSize="52"
            fontFamily="Manrope, sans-serif"
            fill="#FFFFFF"
            opacity="0.9"
          >
            404
          </text>

          {/* Page Missing caption */}
          <text
            x="160"
            y="168"
            textAnchor="middle"
            fontWeight="500"
            fontSize="12"
            fontFamily="Manrope, sans-serif"
            fill="#FFFFFF"
            opacity="0.8"
            letterSpacing="0.08em"
          >
            Page Missing
          </text>
        </svg>
      </div>
    </div>
  );
};

export default NotFoundIllustration;
