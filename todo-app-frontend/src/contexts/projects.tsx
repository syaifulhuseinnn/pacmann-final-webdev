import React, { createContext, useReducer } from "react";
import { Projects, Project } from "../types/projects";

type Props = {
  children: React.ReactNode;
};

type InitialStateType = {
  projects: {
    isPending: boolean;
    data: Projects;
    isRejected: boolean;
    isFulfilled: boolean;
  };
  selectedProject: string;
};

const initialState: InitialStateType = {
  projects: {
    isPending: false,
    data: {
      user_id: "",
      projects: [],
    },
    isRejected: false,
    isFulfilled: false,
  },
  selectedProject: "",
};

type ACTIONTYPE =
  | { type: "FETCH_PENDING"; payload: boolean }
  | { type: "FETCH_FULFILLED"; payload: Projects }
  | { type: "FETCH_REJECTED"; payload: boolean }
  | { type: "SET_SELECTED_PROJECT"; payload: string }
  | { type: "ADD_NEW_TASK"; payload: Projects }
  | { type: "UPDATE_TASK"; payload: Projects }
  | { type: "DELETE_TASK"; payload: Projects }
  | { type: "CREATE_NEW_PROJECT"; payload: Project[] };

const dashboardReducer = (state: typeof initialState, action: ACTIONTYPE) => {
  switch (action.type) {
    case "FETCH_PENDING":
      return {
        ...state,
        projects: {
          ...state.projects,
          isPending: action.payload,
        },
      };
    case "FETCH_FULFILLED":
      return {
        ...state,
        projects: {
          ...state.projects,
          isPending: false,
          data: action.payload,
          isFulfilled: true,
          isRejected: false,
        },
      };
    case "FETCH_REJECTED":
      return {
        ...state,
        projects: {
          ...state.projects,
          isPending: false,
          data: state.projects.data,
          isFulfilled: false,
          isRejected: true,
        },
      };
    case "SET_SELECTED_PROJECT":
      return {
        ...state,
        selectedProject: action.payload,
      };
    case "ADD_NEW_TASK":
      return {
        ...state,
        projects: {
          ...state.projects,
          data: action.payload,
        },
      };
    case "UPDATE_TASK":
      return {
        ...state,
        projects: {
          ...state.projects,
          data: action.payload,
        },
      };
    case "DELETE_TASK":
      return {
        ...state,
        projects: {
          ...state.projects,
          data: action.payload,
        },
      };
    case "CREATE_NEW_PROJECT":
      return {
        ...state,
        projects: {
          ...state.projects,
          data: {
            ...state.projects.data,
            projects: action.payload,
          },
        },
      };
    default:
      return state;
  }
};

const ProjectContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<ACTIONTYPE>;
}>({ state: initialState, dispatch: () => null });

const ProjectProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectProvider };
