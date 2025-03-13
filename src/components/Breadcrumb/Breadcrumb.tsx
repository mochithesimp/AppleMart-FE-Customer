import { Link } from "react-router-dom";

type BreadcrumbProps = {
  paths: { name: string; link?: string }[];
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <div className="dark:bg-gray-900 dark:text-white text-gray-500 text-sm mb-4 mt-10  ml-56 fixed w-[100%] h-[40px] bg-white">
      {paths.map((path, index) => (
        <span key={index}>
          {index !== 0 && <span className="mx-1">›</span>}
          {path.link ? (
            <Link to={path.link} className="hover:underline">
              {path.name}
            </Link>
          ) : (
            <span className="font-semibold dark:text-white text-black">{path.name}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;