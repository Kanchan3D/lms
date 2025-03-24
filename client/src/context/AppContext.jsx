import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency=import.meta.env.VITE_CURRENCY;
    const navigate=useNavigate();

    const [allCourses,setAllCourses]=useState([]);
    const [isEducator,setIsEducator]=useState(true);
    //fetch all courses
    const fetchAllCourses=async()=>{
        setAllCourses(dummyCourses);
    }

    // function to calculate rating
    const calculateRating=(course)=>{
        if(course.courseRatings.length===0){
            return 0;
        }
        let total=0;
        course.courseRatings.forEach(rating=>total+=rating.rating);
        return total/course.courseRatings.length;
    }
    const calculateChapterTime=(chapter)=>{
        let time=0;
        chapter.chapterContent.map(lecture=>{
            time+=lecture.lectureDuration;
        })
        return humanizeDuration(time*60*1000,{units:['h','m']})
    }
    const calculateCourseDuration=(course)=>{
        let time=0;
        course.courseContents.map(content=>time+=content.chapterContent.map(lecture=>time+=content.lectureDuration))
        return humanizeDuration(time*60*1000,{units:['h','m']});
    }
    const calculateNoOfLectures=(course)=>{
        let totalLectures=0;
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures+=chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    useEffect(()=>{
        fetchAllCourses();
    }
    ,[])
    const value={currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures};
    return (
        <AppContext.Provider value={value}>
           { props.children}
        </AppContext.Provider>
    )
}