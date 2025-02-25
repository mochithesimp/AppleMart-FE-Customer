import { useCallback } from "react";
import { gsap } from "gsap";

type AnimationElements = {
  button: React.RefObject<HTMLButtonElement>;
  box: React.RefObject<HTMLDivElement>;
  truck: React.RefObject<HTMLDivElement>;
};

export const useCheckoutAnimation = ({
  button,
  box,
  truck,
}: AnimationElements) => {
  return useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!button.current || !box.current || !truck.current) return;

      if (!button.current.classList.contains("done")) {
        if (!button.current.classList.contains("animation")) {
          button.current.classList.add("animation");

          gsap.to(button.current, {
            "--box-s": 1,
            "--box-o": 1,
            duration: 0.3,
            delay: 0.5,
          });

          gsap.to(box.current, {
            x: 0,
            duration: 0.4,
            delay: 0.7,
          });

          gsap.to(button.current, {
            "--hx": -5,
            "--bx": 50,
            duration: 0.18,
            delay: 0.92,
          });

          gsap.to(box.current, {
            y: 0,
            duration: 0.1,
            delay: 1.15,
          });

          gsap.set(button.current, {
            "--truck-y": 0,
            "--truck-y-n": -26,
          });

          gsap.to(button.current, {
            "--truck-y": 1,
            "--truck-y-n": -25,
            duration: 0.2,
            delay: 1.25,
            onComplete() {
              const tl = gsap.timeline({
                onComplete() {
                  button.current?.classList.add("done");
                },
              });

              tl.to(truck.current, {
                x: 0,
                duration: 0.4,
              })
                .to(truck.current, {
                  x: 40,
                  duration: 1,
                })
                .to(truck.current, {
                  x: 20,
                  duration: 0.6,
                })
                .to(truck.current, {
                  x: 96,
                  duration: 0.4,
                });

              gsap.to(button.current, {
                "--progress": 1,
                duration: 2.4,
                ease: "power2.in",
              });
            },
          });
        }
      } else {
        button.current.classList.remove("animation", "done");
        gsap.set(truck.current, {
          x: 4,
        });
        gsap.set(button.current, {
          "--progress": 0,
          "--hx": 0,
          "--bx": 0,
          "--box-s": 0.5,
          "--box-o": 0,
          "--truck-y": 0,
          "--truck-y-n": -26,
        });
        gsap.set(box.current, {
          x: -24,
          y: -6,
        });
      }
    },
    [button, box, truck]
  );
};
