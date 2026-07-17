import logoImg from '../../assets/logoBG.png';

const GRADIENT =
  'linear-gradient(to bottom, #1e8aff 0%, #1252d4 40%, #0a2ba8 70%, #06176e 100%)';

export default function BrandLogo({
  logoHeight = 'h-12',
  textSize   = 'text-xl',
  showText   = true,
  className  = '',
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoImg}
        alt="Blinkus"
        className={`${logoHeight} w-auto object-contain`}
      />
      {showText && (
        <span 
          className={`${textSize} font-extrabold leading-none tracking-tight select-none`}
          style={{
            // fontFamily:           "Oktah Neue Bold",
            fontFamily:           "'Comfortaa', 'sans-serif'",
            background:           GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}
        >
          
        </span>
      )}
    </div>
  );
}
