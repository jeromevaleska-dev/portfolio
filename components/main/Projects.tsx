import React from "react";
import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      id="projects"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
        My Projects
      </h1>
      <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="/reactsocialmedia1.png"
          title="Social Media Platform"
          description="FreeLance Project worked using react-native so it can be displayed in mobile (android/ios) as well as web. More of just UI no backend involved."
        />
        <ProjectCard
          src="/foodorder.png"
          title="Food Order Website"
          description="This is a fullstack project. Where frontend is created by react and backend used is Node, Expressjs and mongodb. Deployed using Nginx"
        />
        <ProjectCard
          src="/nikedash.png"
          title="Inspired Nike Analytics"
          description="The dashboard is developed using typescript. Frontend React while backend used is nestjs which is a upcoming secure framework"
        />
      </div>
    </div>
  );
};

export default Projects;
