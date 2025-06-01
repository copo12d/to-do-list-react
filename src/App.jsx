import { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faSun, faMoon  } from '@fortawesome/free-regular-svg-icons'
import './App.css'

const trash = <FontAwesomeIcon icon={faTrashCan}/>
const sun = <FontAwesomeIcon icon={faSun}/>
const moon = <FontAwesomeIcon icon={faMoon}/>

function App() {

  const [task, setTask] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : [{ id: 1, title: 'Tarea de ejemplo', state: false }]
  })
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(task))
  }, [task])
  const [checked, setChecked] = useState(task.map(t => t.state))
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  
  useEffect(() => {
    document.body.className = darkMode ? 'light-mode' : 'dark-mode'
  }, [darkMode])

  const handleCheck = (id) => {
    setTask(task.map(t =>
      t.id === id ? { ...t, state: !t.state } : t
    ))
  }
  const handleEdit = (id, title) => {
    setEditingId(id)
    setEditingTitle(title)
  }

  const handleEditChange = (e) => {
    setEditingTitle(e.target.value)
  }

  const handleEditSubmit = (id) => {
    setTask(task.map(t =>
      t.id === id ? { ...t, title: editingTitle } : t
    ))
    setEditingId(null)
    setEditingTitle('')
  }

  const handleDeleteTask = (id) => {
    setTask(current =>
      current.map(t =>
        t.id === id ? { ...t, isRemoving: true } : t
      )
    )
    setTimeout(() => {
      setTask(current => current.filter(t => t.id !== id))
    }, 400)
  }

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      if (editingTitle.trim() === '') {
        handleDeleteTask(id)
      } else {
        handleEditSubmit(id)
      }
    }

  }

  const handleAddTask = () => {
    const newId = task.length > 0 ? Math.max(...task.map(t => t.id)) + 1 : 1
    const newTask = { id: newId, title: '', state: false, isNew: true }
    setTask([...task, newTask])
    setEditingId(newId)
    setEditingTitle('')

    setTimeout(() => {
      setTask(current =>
        current.map(t =>
          t.id === newId ? { ...t, isNew: false } : t
        )
      )
    }, 400)
  }
  

  return (
    <>
    <div>
      <button className={darkMode ? 'btn-dark-mode-dark' : 'btn-dark-mode-light'} onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? moon : sun}
      </button>

    </div>
      <div className="container-todo">
        <h1 className={darkMode ? 'title-dark' : 'title-light'}>
          TO DO LIST
        </h1>
        <ul className="todo-list">
          {
            task.map((t) => (
              <li
                key={t.id}
                className={
                  (t.state ? 'todo-item-completed' : 'todo-item') +
                  (t.isNew ? ' new-task-expand' : '') +
                  (t.isRemoving ? ' task-collapse' : '')
                }
              >
                <>
                  <input 
                  type="checkbox" 
                  checked={t.state}
                  onChange={() => handleCheck(t.id)}
                  className='check-task' />
                  {editingId === t.id ? (
                    <input
                      type="text"
                      className="input-task input-task-editing"
                      value={editingTitle}
                      autoFocus
                      onChange={handleEditChange}
                      onBlur={() => handleEditSubmit(t.id)}
                      onKeyDown={(e) => handleEditKeyDown(e, t.id)}
                    />
                  ) : (
                    <span
                      onClick={() => handleEdit(t.id, t.title)}
                      className={
                        (t.state ? 'task-completed' : 'task-title') +
                        (editingId === t.id ? ' editing' : '') +
                        (darkMode ? ' task-light' : ' task-dark')
                      }
                    >
                      {t.title}
                    </span>
                  )}
                  <button onClick={() => handleDeleteTask(t.id)} className={darkMode ? 'btn-delete-light' : 'btn-delete-dark'}>
                    {trash}
                  </button>
                </>
              </li>
            ))
          }
        </ul>
        <button onClick={handleAddTask} className='btn-add'>+ Add Task</button>
      </div>
    </>
  )
}

export default App
