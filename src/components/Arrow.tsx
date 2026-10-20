import Image from "next/image";

type ArrowProps = {
  className?: string;
  size?: number;
};

const Arrow = ({ className = "", size = 20 }: ArrowProps) => (
  <Image
    aria-hidden="true"
    className={className}
    src="/arrow-up-right.svg"
    alt=""
    width={size}
    height={size}
  />
);

export default Arrow;
