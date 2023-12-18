import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import videoSrcMobile from '../../assets/banner-video/hero-video-mobile.mp4';
import posterImg from '../../assets/banner-video/hero-video-poster.jpeg';
import videoSrc from '../../assets/banner-video/hero-video.mp4';

const SMALL_BREAKPOINT_PX_SIZE = 768;

const getSrcType = (width: number) =>
  width >= SMALL_BREAKPOINT_PX_SIZE || 'small';

const useWindowResizeHook = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    function didResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', didResize);
    didResize();

    return () => window.removeEventListener('resize', didResize);
  }, []);

  return windowWidth;
};

function useVideoSrcEffect(width: number) {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [videoSrcType, setVideoSrcType] = useState(getSrcType(width));

  useEffect(() => {
    const newType = getSrcType(width);
    setVideoSrcType(newType);
    if (videoEl.current != null && videoSrcType !== newType) {
      videoEl.current.load();
    }
  }, [width, videoSrcType]);

  return videoEl;
}
type Props = {
  altText?: string;
  style?: CSSProperties;
};
const VideoHeader = ({ altText, style }: Props) => {
  const width = useWindowResizeHook();
  const videoEl = useVideoSrcEffect(width);
  const src = width >= SMALL_BREAKPOINT_PX_SIZE ? videoSrc : videoSrcMobile;

  return (
    <div className="d-block hero-video">
      <div className="hero-video--container">
        <video
          muted
          autoPlay
          loop
          playsInline
          poster={posterImg}
          className="hero-video--vid"
          ref={videoEl}
        >
          <source src={src} type="video/mp4"></source>
        </video>

        <div className="hero-video--aspect-container"></div>

        <p className="hero-video--copy" style={style}>
          {altText
            ? altText
            : 'Learn the game from your favorite college athlete'}
        </p>
      </div>
    </div>
  );
};
export { VideoHeader };
