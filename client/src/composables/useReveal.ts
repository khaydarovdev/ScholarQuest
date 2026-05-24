import { onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useReveal() {
  let ctx: gsap.Context | undefined;

  onMounted(() => {
    ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 22, filter: 'blur(10px)', rotateX: 6 },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            rotateX: 0,
            duration: 1.0,
            ease: 'power4.out',
            delay: index * 0.04,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%'
            }
          }
        );
      });
    });
  });

  onBeforeUnmount(() => {
    ctx?.revert();
  });
}
