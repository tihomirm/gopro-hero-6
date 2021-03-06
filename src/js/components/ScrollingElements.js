import { TweenMax, Power4 } from 'gsap';
import { ease } from './utils';

class ScrollingElements {
  /**
   * ScrollingElements constructor
   * @param window - Global window object
   * @param container - DOM element where everything happens
   * @param elements - Array of objects that describes every steps
   */
  constructor(window, container, elements) {
    this.window = window;
    this.container = container;
    this.elements = elements;
    this.BREAKPOINT = 1080;
    this.currentPercentage = 0;
    this.observer = null;
    this.currentIndex = null;
    this.previousIndex = null;
    this.onScrollEvent = this.onScroll.bind(this);

    this.initElements();

    this.observer = new IntersectionObserver(
      observables => {
        observables.forEach(observable => {
          if (observable.intersectionRatio >= 0) {
            window.addEventListener('scroll', this.onScrollEvent, false);
          } else {
            window.removeEventListener('scroll', this.onScrollEvent, false);
          }
        });
      },
      {
        threshold: [0]
      }
    );

    this.initEvents();
  }

  /**
   * setupDesktop()
   * Update all elements according to
   * the size of the viewport (Large)
   */
  setupDesktop() {
    this.elements.forEach((element, index) => {
      if (index !== 0) {
        TweenMax.set(element.source, {
          opacity: 0
        });
      }

      TweenMax.set(element.titleParts, {
        y: '-110%'
      });

      TweenMax.set(element.description, {
        y: '-110%'
      });
    });

    this.observer.observe(this.container);
  }

  /**
   * setupMobile()
   * Update all elements according to
   * the size of the viewport (Small)
   */
  setupMobile() {
    window.removeEventListener('scroll', this.onScrollEvent, false);

    this.elements.forEach(element => {
      TweenMax.set(element.source, {
        opacity: 1
      });

      TweenMax.set(element.titleParts, {
        y: '0%'
      });

      TweenMax.set(element.description, {
        y: '0%'
      });
    });

    this.observer.unobserve(this.container);
  }

  /**
   * initEvents()
   * Listen to window width to call
   * the rights settings
   */
  initEvents() {
    if (this.window.innerWidth <= this.BREAKPOINT) {
      this.setupMobile();
    } else {
      this.observer.observe(this.container);
    }

    this.window.addEventListener('resize', () => {
      if (this.window.innerWidth <= this.BREAKPOINT) {
        this.setupMobile();
      } else {
        this.setupDesktop();
      }
    });
  }

  /**
   * getCurrentElement()
   * Get the current element according
   * to the current percentage
   * @return {number} wantedIndex - Index of the current element
   */
  getCurrentElement() {
    let wantedIndex = null;

    this.elements.forEach((element, index) => {
      if (
        element.from <= this.currentPercentage &&
        element.to > this.currentPercentage
      ) {
        wantedIndex = index;
      }
    });

    return wantedIndex;
  }

  /**
   * onScroll()
   * Listen to scroll event to
   * update the current percentage if needed
   */
  onScroll() {
    const { top, height } = this.container.getBoundingClientRect();
    const percentage = Math.min(
      Math.max(Math.floor(top / -height * 100), 0),
      100
    );

    if (percentage !== this.currentPercentage) {
      this.currentPercentage = percentage;
      this.onPercentageChange();
    }
  }

  /**
   * onPercentageChange()
   * Update currentIndex if needed
   */
  onPercentageChange() {
    const wantedCurrentIndex = this.getCurrentElement();

    if (this.currentIndex !== wantedCurrentIndex) {
      this.previousIndex = this.currentIndex;
      this.currentIndex = wantedCurrentIndex;
      this.onIndexChange();
    }
  }

  /**
   * onIndexChange()
   * Animate previous and current step when
   * the index changes
   */
  onIndexChange() {
    if (this.previousIndex !== null) {
      TweenMax.staggerTo(
        this.elements[this.previousIndex].titleParts,
        0.6,
        {
          y: '-110%',
          ease
        },
        0.1
      );

      TweenMax.to(this.elements[this.previousIndex].description, 0.6, {
        y: '-110%',
        ease
      });

      TweenMax.to(this.elements[this.previousIndex].source, 0.4, {
        opacity: 0,
        ease: Power4.easeOut
      });

      this.elements[this.previousIndex].source.pause();
    }

    TweenMax.set(this.elements[this.currentIndex].titleParts, {
      y: '110%'
    });

    TweenMax.set(this.elements[this.currentIndex].description, {
      y: '110%'
    });

    TweenMax.staggerTo(
      this.elements[this.currentIndex].titleParts,
      0.6,
      {
        y: '0%',
        ease
      },
      0.1
    );

    TweenMax.to(this.elements[this.currentIndex].description, 0.6, {
      y: '0%',
      ease
    });

    TweenMax.set(this.elements[this.currentIndex].source, {
      opacity: 1
    });

    this.elements[this.currentIndex].source.currentTime = 0;
    this.elements[this.currentIndex].source.play();
  }

  /**
   * initElements()
   * Split the title of each elements
   * and set default positions
   */
  initElements() {
    this.elements.forEach((element, index) => {
      const title = element.title.innerHTML.split(' ');
      element.title.innerHTML = title
        .map(
          (el, index) =>
            `
            <div class="text-revelation__wrapper">
              <span class="text-revelation__text${
                index === title.length - 1 ? ' text-revelation__text--last' : ''
              }">${el}</span>
            </div>
          `
        )
        .join('');

      element.titleParts = [].slice.call(
        element.title.querySelectorAll('.text-revelation__text')
      );

      if (index !== 0) {
        TweenMax.set(element.source, {
          opacity: 0
        });
      }

      TweenMax.set(element.titleParts, {
        y: '-110%'
      });

      TweenMax.set(element.description, {
        y: '-110%'
      });
    });
  }
}

export default ScrollingElements;
