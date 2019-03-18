const axios = require('axios')
const rawInput = require('readline-sync').question
const courseUrl = `http://saral.navgurukul.org/api/courses`



// Pure Function

const selectOneFromArray = (array, message) => {
    while (true) {
        const serialNo = rawInput(message)

        // validation of courses.
        if (serialNo > array.length || serialNo < 0) {
            console.log("Wrong selection")
        } else {
            return array[serialNo - 1];
        }
    }
}

const getCourseId = async () => {
    const courseResponse = await axios.get(courseUrl)
    const availableCourses = courseResponse.data.availableCourses

    for (let i = 0; i < availableCourses.length; i++) {
        console.log(i + 1, availableCourses[i].name)
    }

    return selectOneFromArray(availableCourses, "Select one course: ").id
    // let course = selectOneFromArray(availableCourses, "Select one course: ")
    // return course.id
}


const getExercisesList = async (courseId) => {
    const exercisesUrl = `${courseUrl}/${courseId}/exercises`
    const exercisesResponse = await axios.get(exercisesUrl)
    const exercises = exercisesResponse.data.data
    return exercises
}


const getSlugs = async (exercises) => {
    let slugs = []
    for (let i = 0; i < exercises.length; i++) {
        let parentSlug = exercises[i].slug
        slugs.push(parentSlug)
        for (let j = 0; j < exercises[i].childExercises.length; j++) {
            let childSlug = exercises[i].childExercises[j].slug
            slugs.push(childSlug)
        }
    }
    return slugs
}

const displayExercisesList = (exercises) => {
    let serialNo = 1
    for (let i = 0; i < exercises.length; i++) {
        let exercise = exercises[i]
        console.log(serialNo, exercise.name)
        serialNo++

        for (let j = 0; j < exercise.childExercises.length; j++) {
            let childExercise = exercise.childExercises[j]
            console.log(serialNo, childExercise.name)
            serialNo++
        }
    }
}
const nextOrPrev = async(currentSlug, slugs, courseId) => {
    let currentSlugIndex = slugs.indexOf(currentSlug)

    let showContent = true

    while (true) {
        if (showContent){
            let exerciseUrl = `${courseUrl}/${courseId}/exercise/getBySlug?slug=${currentSlug}`
            const exerciseResponse = await axios.get(exerciseUrl)
            console.log(exerciseResponse.data.content)
        }

        const userInput = rawInput("Press Next(n/N) / Previous(p/P) / Back or Up (u/U)")
        if (userInput === 'u' || userInput === 'U') {
            return
        } else if (userInput === 'p' || userInput === 'P') {
        
            if (currentSlugIndex > 0){
                currentSlugIndex--
                showContent = true
            } else {
                console.log("You are already in first exercise.")
                showContent = false
            }
            
        } else if (userInput === 'n' || userInput === 'N') {
            
            if (currentSlugIndex < slugs.length - 1){
                currentSlugIndex++
                showContent = true
            } else {
                console.log("You are already in last exercise.")
                showContent = false
            } 
        } else {
            console.log("Wrong input")
        }

        currentSlug = slugs[currentSlugIndex]
    }
}

const start = async () => {
    // 
    while(true){

        let userInput = rawInput("Continue(c/C) or Back/Up(u/U)")
        if (userInput === 'c' || userInput === 'C') {
            const courseId = await getCourseId()
            
            while(true){
                let userInput = rawInput("Continue(c/C) or Back/Up(u/U)")
                if (userInput === 'c' || userInput === 'C') {
                    
                    const exercises = await getExercisesList(courseId)
                    const slugs = await getSlugs(exercises)
                    displayExercisesList(exercises)
                    let currentSlug = selectOneFromArray(slugs, "Select the exercise: ")
                    await nextOrPrev(currentSlug, slugs, courseId)
    
                } else if (userInput === 'u' || userInput === 'U') {    
                    break
                } else {
                    console.log("Wrong Input")
                }
            }
        } else if (userInput === 'u' || userInput === 'U') {
            break
        } else {
            console.log("Wrong Input")
        }
    }
}



// currentSlugIndex  = currentSlugIndex > 0? 
//                     currentSlugIndex - 1
//                     : currentSlugIndex

// currentSlugIndex  = currentSlugIndex < slugs.length - 1? 
//                     currentSlugIndex + 1
//                     : currentSlugIndex 

start()