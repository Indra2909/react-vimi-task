import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

// convert numeric month to string
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

enum Status {
  Incomplete = "INCOMPLETE", // project brief is not complete, still being written by the user.
  Shooting = "SHOOTING", // project is in shooting phase.
  Editing = "EDITING", // video is in editing phase.
  Feedback = "FEEDBACK", // a draft of the final film needs feedback
  Completed = "COMPLETED", // project is deemed completed
}

enum Type {
  Educational = "educational",
  Testimonial = "testimonial",
  Training = "training",
  Recreational = "recreational",
}

interface Project {
  id: number;
  name: string; // name of type string
  status: Status; // status is a string enum
  type: Type; // type is an string enum
  createdOn: Date; // createdOn is a Date
  archived: boolean; //archived is a bool
}

const Projects = () => {
  const [listOfProjects, setListOfProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [advancedFilter, setAdvancedFilter] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [archived, setArchived] = useState<string>("false");
  const [date, setDate] = useState<string>("0-0-0");

  useEffect(() => {
    const fetchAllProjects = async () => {
      const getProject = await fetchProjects();
      setListOfProjects(getProject);
      setFilteredProjects(
        getProject.filter(
          (project: { archived: boolean }) => project.archived === false
        )
      );
    };

    fetchAllProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:5000/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  };

  const sortDate = (sortingMethod: string) => {
    const newResult = [...filteredProjects];
    if (sortingMethod === "asc") {
      newResult.sort(
        (projectA, projectB) =>
          convertDateToNum(projectA.createdOn).getTime() -
          convertDateToNum(projectB.createdOn).getTime()
      );
    }
    if (sortingMethod === "desc") {
      newResult.sort(
        (projectA, projectB) =>
          convertDateToNum(projectB.createdOn).getTime() -
          convertDateToNum(projectA.createdOn).getTime()
      );
    }

    setFilteredProjects(newResult);
  };

  const convertDate = (date: Date) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = monthNames[newDate.getMonth()];
    const day = newDate.getDate();

    return `${month} ${day}, ${year}`;
  };

  const convertDateToNum = (date: Date) => {
    const tempDate = new Date(date);
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth() + 1;
    const day = tempDate.getDate();

    const newDate = new Date(`${year}-${month}-${day}`);
    return newDate;
  };

  const filter = (
    date: string,
    searchText: string,
    type: string,
    status: string,
    archived: string
  ) => {
    let newResult = [...listOfProjects];

    let newDate = new Date(date);

    if (date !== "" || type !== "" || status !== "" || archived !== "") {
      setType(type);
      setStatus(status);
      setArchived(archived);
      setDate(date);
      newDate = new Date(date);
    }

    switch (archived) {
      case "false":
        console.log("case: false");
        newResult = newResult.filter(
          (project) =>
            project.type.includes(type) &&
            project.status.includes(status) &&
            project.archived === false &&
            convertDateToNum(project.createdOn) >= convertDateToNum(newDate)
        );
        break;
      case "true":
        console.log("case: true");
        newResult = newResult.filter(
          (project) =>
            project.type.includes(type) &&
            project.status.includes(status) &&
            project.archived === true &&
            convertDateToNum(project.createdOn) >= convertDateToNum(newDate)
        );
        break;
      case "all":
        console.log("case: all");
        newResult = newResult.filter(
          (project) =>
            project.type.includes(type) &&
            project.status.includes(status) &&
            convertDateToNum(project.createdOn) >= convertDateToNum(newDate)
        );
        break;
    }

    const lowerCaseValue = searchText.toLowerCase().trim();
    if (lowerCaseValue.length === 0) {
      // newResult = tempProjects;
    } else {
      const filteredData = (newResult as any[]).filter((item) => {
        return Object.keys(item).some((key) => {
          return item[key].toString().toLowerCase().includes(lowerCaseValue);
        });
      });
      newResult = filteredData;
    }

    setFilteredProjects(newResult);
  };

  const handleChange = (value: string) => {
    setSearchText(value);
    filter(date, value, type, status, archived);
  };

  const handleClick = () => {
    setAdvancedFilter(!advancedFilter);
  };

  return (
    <div className="">
      <div className="container  bg-white bg-opacity-75 rounded py-4">
        {/* HEADING */}
        <div className="container d-flex justify-content-between mb-3">
          <h4 className="fw-bold">
            Recent Projects | {filteredProjects.length} Projects
          </h4>
          <select
            className="rounded px-3 py-1 border text-secondary fw-semibold"
            onChange={(e) => sortDate(e.currentTarget.value)}
            defaultValue={"none"}
          >
            <option value="none" style={{ display: "none" }}>
              Sort By
            </option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* SEARCH & FILTER */}
        <div className="mb-3">
          {/* SEARCH */}
          <div className="mb-2 d-flex gap-2 align-items-center">
            <section>Search: </section>
            <input
              type="text"
              placeholder="Type to search..."
              value={searchText}
              onChange={(e) => handleChange(e.target.value)}
              className="border px-2 w-100 rounded py-1"
            />
          </div>

          {/* TEXT FILTER */}
          <div className="d-flex justify-content-end mb-2">
            <button
              className={`btn text-white px-2 py-1 ${
                advancedFilter ? "btn-danger" : "btn-dark"
              }`}
              onClick={handleClick}
            >
              {advancedFilter ? "Advanced Filter" : "Advanced Filter"}
            </button>
          </div>
          {/* ADVANCED FILTER */}
          {advancedFilter && (
            <div className="d-flex justify-content-end gap-2">
              {/* DATE */}
              <input
                type="date"
                onChange={(e) =>
                  filter(
                    e.currentTarget.value,
                    searchText,
                    type,
                    status,
                    archived
                  )
                }
                className="border rounded px-2 text-secondary"
              ></input>

              {/* TYPE */}
              <select
                className="rounded px-2 border text-secondary"
                onChange={(e) =>
                  filter(
                    date,
                    searchText,
                    e.currentTarget.value,
                    status,
                    archived
                  )
                }
                defaultValue={"none"}
              >
                <option value="none" style={{ display: "none" }}>
                  Type
                </option>
                <option value="">All</option>
                <option value={Type.Educational}>Educational</option>
                <option value={Type.Testimonial}>Testimonial</option>
                <option value={Type.Training}>Training</option>
                <option value={Type.Educational}>Recreational</option>
              </select>

              {/* STATUS */}
              <select
                className="rounded px-2 border text-secondary"
                onChange={(e) =>
                  filter(
                    date,
                    searchText,
                    type,
                    e.currentTarget.value,
                    archived
                  )
                }
                defaultValue={"none"}
              >
                <option value="none" style={{ display: "none" }}>
                  Status
                </option>
                <option value="">All</option>
                <option value={Status.Incomplete}>Incomplete</option>
                <option value={Status.Shooting}>Shooting</option>
                <option value={Status.Editing}>Editing</option>
                <option value={Status.Feedback}>Feedback</option>
                <option value={Status.Completed}>Completed</option>
              </select>

              {/* ARCHIVED */}
              <select
                className="rounded px-2 border text-secondary"
                onChange={(e) =>
                  filter(date, searchText, type, status, e.currentTarget.value)
                }
                defaultValue="false"
              >
                <option value="false">Not Archived</option>
                <option value="all">All</option>
                <option value="true">Archived</option>
              </select>
            </div>
          )}
        </div>

        {/* TABLE HEADER */}
        <div className="container">
          <div className="row rounded bg-danger fw-bold align-items-center py-2 text-white">
            <div className="col-4">Name</div>
            <div className="col-2">Type</div>
            <div className="col-2">Status</div>
            <div className="col-2 text-center">Created</div>
            <div className="col-2 text-center">Manage</div>
          </div>
        </div>
        {/* TABLE CONTENT */}
        <div className="container">
          {filteredProjects.map((project) => (
            <div
              className="row rounded justify-content-center bg-white my-3 align-items-center py-1"
              key={project.id}
            >
              <div className="col-4 py-1">{project.name}</div>
              <div className="col-2 py-1 text-capitalize">{project.type}</div>
              <div className="col-2 py-1 text-lowercase">{project.status}</div>
              <div className="col-2 py-1 text-center">
                {convertDate(project.createdOn)}
              </div>
              <div className="col-2 py-1 text-center">
                <BsThreeDotsVertical />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
