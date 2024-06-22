import { useForm } from 'react-hook-form'
import { createTasks, deleteTask, updateTask, getTask} from '../api/task.api'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import {toast} from 'react-hot-toast'

export function TaskFormPage() {

  const { 
    register,
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm()
  const navigate = useNavigate()
  const params = useParams()
  console.log(params)

  const onSubmit = handleSubmit(async data => {
  if (params.id){
    await updateTask(params.id, data)
    toast.success('Updated Task',{
      position: "bottom-right",
      style: {
        background: "#101010",
        color: "#fff" 
      }
    })
  }
  else{
    await createTasks(data)
    toast.success('Created Task',{
      position: "bottom-right",
      style: {
        background: "#101010",
        color: "#fff" 
      }
    })
  }
  navigate('/tasks')

  })

  useEffect(()  => {
    async function loadTask(){
      if (params.id)
        {
         const res = await getTask(params.id)
         setValue('title', res.data.title)
         setValue('description', res.data.description)
        }
    }
    loadTask()
  }, [])

  return (
    <div className='max-w-xl mx-auto' >
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Title"
          {...register("title", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
          />
        {errors.title && <span>This field is required</span>}
        <textarea rows="3" placeholder="Description"
          {...register("description", { required: true })}
          className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
          
          ></textarea>
        {errors.description && <span>This field is required</span>}

        <button className='bg-indigo-500 p-3 rounded-lg block w-full mt-3' >Save</button>
      </form>
      
      {params.id &&
      <div className='flex justify-end'>
         <button className='bg-red-500 p-3 rounded-lg w-48 mt-3'  onClick={async () =>{
        const accepted = window.confirm('are you sure')
        if (accepted){
          await deleteTask(params.id)
          toast.success('Eliminated Task',{
            position: "bottom-right",
            style: {
              background: "#101010",
              color: "#fff" 
            }
          })
          navigate('/tasks')
        }
      }} >Delete</button>
      </div>
      }
    </div>
  )
}
