import { TweenMax, Power4 } from 'gsap';
import { map } from '../components/utils';
import TextRevelation from '../components/TextRevelation';
import { intersectionObserver } from '../components/utils';

const $section = document.querySelector('.wide-angle');
const $title = document.querySelector('.wide-angle__title');
const $source = document.querySelector('.wide-angle__illustration');
const $sourceSource = document.querySelector('.wide-angle__source');
const $borderLeft = document.querySelector('.wide-angle__border-left');
const $borderRight = document.querySelector('.wide-angle__border-right');
let windowHeight = window.innerHeight;

const titleRevelation = new TextRevelation($title);

document.addEventListener('resize', () => {
  windowHeight = window.innerHeight;
});

document.addEventListener('scroll', () => {
  const gbcr = $source.getBoundingClientRect();
  let value = Math.floor(-windowHeight + gbcr.top + gbcr.height * (2 / 3));

  if (value > gbcr.height * (2 / 3)) {
    value = Math.floor(gbcr.height * (2 / 3));
  }

  if (value < 0) {
    value = 0;
  }

  const mappedValue = map(value, 0, Math.floor(gbcr.height * (2 / 3)), 0, 1);
  TweenMax.to($borderLeft, 1.8, {
    css: {
      scaleX: mappedValue
    },
    ease: Power4.easeOut
  });

  TweenMax.to($borderRight, 1.8, {
    css: {
      scaleX: mappedValue
    },
    ease: Power4.easeOut
  });

  TweenMax.to($sourceSource, 1.8, {
    css: {
      scale: 1.05 + mappedValue * 0.2
    },
    ease: Power4.easeOut
  });
});

intersectionObserver($section, () => {
  titleRevelation.reveal();
});

let sourceWidth = Math.round($sourceSource.offsetWidth);
let sourceHeight = Math.round($sourceSource.offsetHeight);
let containerWidthCenter = Math.round($source.offsetWidth / 2);
let containerHeightCenter = Math.round($source.offsetHeight / 2);

document.addEventListener('resize', () => {
  containerWidthCenter = Math.round($source.offsetWidth / 2);
  containerHeightCenter = Math.round($source.offsetHeight / 2);

  sourceWidth = Math.round($sourceSource.offsetWidth);
  sourceHeight = Math.round($sourceSource.offsetHeight);
});

$source.addEventListener('mousemove', event => {
  const x = -containerWidthCenter + event.clientX;
  const y = containerHeightCenter - event.clientY;

  const mappedX = Math.round(map(x, 0, containerWidthCenter, 0, 10));
  const mappedY = Math.round(map(y, 0, containerHeightCenter, 0, 10));

  TweenMax.to($sourceSource, 1.8, {
    x: -mappedX,
    y: mappedY,
    z: 30,
    rotationY: Math.round(mappedY * 0.05),
    rotationX: Math.round(mappedX * 0.05),
    ease: Power4.easeOut
  });
});