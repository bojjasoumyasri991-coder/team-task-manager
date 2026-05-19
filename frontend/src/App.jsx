import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function App() {
  // ================= AUTH =================
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isSignup, setIsSignup] =
    useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [token, setToken] = useState("");

  const [role, setRole] =
    useState("member");

  // ================= PAGE =================
  const [activePage, setActivePage] =
    useState("dashboard");

  // ================= PROJECTS =================
  const [projects, setProjects] =
    useState([]);

  const [projectName, setProjectName] =
    useState("");

  const [
    projectDescription,
    setProjectDescription,
  ] = useState("");

  // ================= TASKS =================
  const [tasks, setTasks] = useState([]);

  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskStatus, setTaskStatus] =
    useState("Pending");

  const [dueDate, setDueDate] =
    useState("");

  // ================= RESET =================
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
  }, []);

  // ================= SIGNUP =================
  const handleSignup = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/auth/register",
        {
          name,
          email,
          password,
          role: "member",
        }
      );

      alert("Signup Successful");

      setIsSignup(false);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Signup Failed"
      );
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      setToken(response.data.token);

      setRole(response.data.role);

      setIsLoggedIn(true);

      fetchProjects(response.data.token);

      fetchTasks(response.data.token);

      alert("Login Successful");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Invalid Credentials"
      );
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();

    setIsLoggedIn(false);

    setProjects([]);

    setTasks([]);

    setRole("member");
  };

  // ================= FETCH PROJECTS =================
  const fetchProjects = async (
    authToken = token
  ) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/projects",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH TASKS =================
  const fetchTasks = async (
    authToken = token
  ) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/tasks",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CREATE PROJECT =================
  const createProject = async () => {
    if (
      !projectName ||
      !projectDescription
    ) {
      alert("Please fill all fields");

      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/projects",
        {
          name: projectName,
          description: projectDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project Created");

      setProjectName("");
      setProjectDescription("");

      fetchProjects();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Error creating project"
      );
    }
  };

  // ================= DELETE PROJECT =================
  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:5000/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProjects();

      alert("Project Deleted");
    } catch (error) {
      console.log(error);

      alert("Error deleting project");
    }
  };

  // ================= CREATE TASK =================
  const createTask = async () => {
    if (!taskTitle) {
      alert("Enter task title");

      return;
    }

    if (projects.length === 0) {
      alert("Create project first");

      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/tasks",
        {
          title: taskTitle,
          status: taskStatus,
          due_date: dueDate,
          project_id: projects[0].id,
          assigned_to: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task Created");

      setTaskTitle("");
      setDueDate("");

      fetchTasks();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Error creating task"
      );
    }
  };

  // ================= UPDATE TASK =================
  const updateTaskStatus = async (
    id,
    status
  ) => {
    try {
      await axios.put(
        `http://127.0.0.1:5000/tasks/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DELETE TASK =================
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:5000/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

      alert("Task Deleted");
    } catch (error) {
      console.log(error);

      alert("Error deleting task");
    }
  };

  // ================= ANALYTICS =================
  const analyticsData = [
    {
      name: "Projects",
      value: projects.length,
    },
    {
      name: "Tasks",
      value: tasks.length,
    },
    {
      name: "Completed",
      value: tasks.filter(
        (task) =>
          task.status === "Completed"
      ).length,
    },
  ];

  const pieData = [
    {
      name: "Pending",
      value: tasks.filter(
        (task) =>
          task.status === "Pending"
      ).length,
    },
    {
      name: "In Progress",
      value: tasks.filter(
        (task) =>
          task.status ===
          "In Progress"
      ).length,
    },
    {
      name: "Completed",
      value: tasks.filter(
        (task) =>
          task.status === "Completed"
      ).length,
    },
  ];

  // ================= LOGIN PAGE =================
  if (!isLoggedIn) {
    return (
      <div style={loginContainer}>
        <div style={loginCard}>
          <div style={logoStyle}>🚀</div>

          <h1 style={titleStyle}>
            Team Task Manager
          </h1>

          {isSignup && (
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={inputStyle}
            />
          )}

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={
              isSignup
                ? handleSignup
                : handleLogin
            }
            style={buttonStyle}
          >
            {isSignup ? "Signup" : "Login"}
          </button>

          <p
            onClick={() =>
              setIsSignup(!isSignup)
            }
            style={toggleStyle}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Signup"}
          </p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    "dashboard",

    ...(role === "admin"
      ? ["create project"]
      : []),

    "view projects",

    ...(role === "admin"
      ? ["create task"]
      : []),

    "view tasks",

    "analytics",
  ];

  return (
    <div style={mainContainer}>
      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <h2 style={sidebarTitle}>
          🚀 Task Manager
        </h2>

        <p style={roleStyle}>
          Role: {role.toUpperCase()}
        </p>

        {sidebarItems.map((page) => (
          <p
            key={page}
            onClick={() =>
              setActivePage(page)
            }
            style={{
              ...sidebarItem,
              fontWeight:
                activePage === page
                  ? "bold"
                  : "normal",
            }}
          >
            {page}
          </p>
        ))}

        <button
          onClick={handleLogout}
          style={logoutButton}
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div style={contentStyle}>
        <h1 style={pageTitle}>
          {activePage}
        </h1>

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "25px",
            }}
          >
            {analyticsData.map(
              (item, index) => (
                <div
                  key={index}
                  style={cardStyle}
                >
                  <h3>{item.name}</h3>

                  <h1
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    {item.value}
                  </h1>
                </div>
              )
            )}
          </div>
        )}

        {/* CREATE PROJECT */}
        {activePage ===
          "create project" && (
          <div style={cardStyle}>
            <h2>Create Project</h2>

            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) =>
                setProjectName(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <textarea
              placeholder="Project Description"
              value={
                projectDescription
              }
              onChange={(e) =>
                setProjectDescription(
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                height: "130px",
              }}
            />

            <button
              onClick={createProject}
              style={buttonStyle}
            >
              Create Project
            </button>
          </div>
        )}

        {/* VIEW PROJECTS */}
        {activePage ===
          "view projects" && (
          <div style={cardStyle}>
            <h2>All Projects</h2>

            {projects.length === 0 && (
              <p>
                No projects available
              </p>
            )}

            {projects.map(
              (project) => (
                <div
                  key={project.id}
                  style={itemStyle}
                >
                  <h3>
                    {project.name}
                  </h3>

                  <p>
                    {
                      project.description
                    }
                  </p>

                  {role ===
                    "admin" && (
                    <button
                      onClick={() =>
                        deleteProject(
                          project.id
                        )
                      }
                      style={{
                        marginTop:
                          "15px",
                        background:
                          "#ef4444",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 18px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Delete Project
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {/* CREATE TASK */}
        {activePage ===
          "create task" && (
          <div style={cardStyle}>
            <h2>Create Task</h2>

            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) =>
                setTaskTitle(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <select
              value={taskStatus}
              onChange={(e) =>
                setTaskStatus(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option>
                Pending
              </option>

              <option>
                In Progress
              </option>

              <option>
                Completed
              </option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            <button
              onClick={createTask}
              style={buttonStyle}
            >
              Create Task
            </button>
          </div>
        )}

        {/* VIEW TASKS */}
        {activePage ===
          "view tasks" && (
          <div style={cardStyle}>
            <h2>All Tasks</h2>

            {tasks.length === 0 && (
              <p>No tasks available</p>
            )}

            {tasks.map((task) => (
              <div
                key={task.id}
                style={itemStyle}
              >
                <h3>{task.title}</h3>

                <p>
                  Status: {task.status}
                </p>

                {/* DUE DATE */}
                {task.due_date && (
                  <p>
                    Due Date:{" "}
                    {task.due_date}
                  </p>
                )}

                {/* OVERDUE */}
                {task.status !==
                  "Completed" &&
                  task.due_date &&
                  new Date(
                    task.due_date
                  ) < new Date() && (
                    <p
                      style={{
                        color:
                          "red",
                        fontWeight:
                          "bold",
                        marginTop:
                          "10px",
                      }}
                    >
                      Overdue Task
                    </p>
                  )}

                {/* ADMIN CONTROLS */}
                {role ===
                  "admin" && (
                  <div
                    style={{
                      marginTop:
                        "15px",
                      display:
                        "flex",
                      gap: "10px",
                      alignItems:
                        "center",
                    }}
                  >
                    {/* UPDATE STATUS */}
                    <select
                      value={
                        task.status
                      }
                      onChange={(
                        e
                      ) =>
                        updateTaskStatus(
                          task.id,
                          e.target
                            .value
                        )
                      }
                      style={{
                        padding:
                          "10px",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #ccc",
                      }}
                    >
                      <option>
                        Pending
                      </option>

                      <option>
                        In Progress
                      </option>

                      <option>
                        Completed
                      </option>
                    </select>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() =>
                        deleteTask(
                          task.id
                        )
                      }
                      style={{
                        background:
                          "#ef4444",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "10px 18px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {activePage ===
          "analytics" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "30px",
            }}
          >
            <div style={cardStyle}>
              <h2>
                Overview Analytics
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <BarChart
                  data={
                    analyticsData
                  }
                >
                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#4f46e5"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={cardStyle}>
              <h2>Task Status</h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    <Cell fill="#f59e0b" />

                    <Cell fill="#3b82f6" />

                    <Cell fill="#10b981" />
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= STYLES =================

const loginContainer = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#dbeafe",
};

const loginCard = {
  width: "100%",
  maxWidth: "700px",
  background: "white",
  padding: "60px",
  borderRadius: "30px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.1)",
  textAlign: "center",
};

const logoStyle = {
  fontSize: "60px",
  marginBottom: "10px",
};

const titleStyle = {
  fontSize: "40px",
  marginBottom: "40px",
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginBottom: "20px",
  borderRadius: "15px",
  border: "1px solid #cbd5e1",
  fontSize: "18px",
};

const buttonStyle = {
  width: "100%",
  padding: "18px",
  border: "none",
  borderRadius: "15px",
  background: "#4f46e5",
  color: "white",
  fontSize: "20px",
  cursor: "pointer",
};

const toggleStyle = {
  marginTop: "20px",
  color: "#4f46e5",
  cursor: "pointer",
};

const mainContainer = {
  display: "flex",
  minHeight: "100vh",
  background: "#f1f5f9",
};

const sidebarStyle = {
  width: "260px",
  background: "#0f172a",
  color: "white",
  padding: "40px 25px",
};

const sidebarTitle = {
  fontSize: "30px",
};

const roleStyle = {
  marginTop: "20px",
  marginBottom: "40px",
};

const sidebarItem = {
  marginBottom: "25px",
  cursor: "pointer",
  fontSize: "18px",
  textTransform: "capitalize",
};

const logoutButton = {
  marginTop: "40px",
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};

const contentStyle = {
  flex: 1,
  padding: "40px",
};

const pageTitle = {
  fontSize: "42px",
  marginBottom: "35px",
  textTransform: "capitalize",
};

const cardStyle = {
  background: "white",
  padding: "35px",
  borderRadius: "22px",
};

const itemStyle = {
  background: "#f8fafc",
  padding: "22px",
  borderRadius: "15px",
  marginTop: "18px",
};

export default App;