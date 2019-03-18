const axios = require("axios");
const read = require("readline-sync");

const Base_url = "http://saral.navgurukul.org/api";
const coursesUrl = Base_url + "/courses";
var all_slug;

axios.get(coursesUrl).then(response => {
    const availableCourses = response.data.availableCourses;
    const course_list = []
    for (let i = 0; i < availableCourses.length; i++) {
        let courses = availableCourses[i];
        console.log("----------------------");
        console.log(i + 1, "Courses Name", courses.name);

        course_list.push(courses.id)

    }
    return course_list
}).then((course_list) => {
    var number = read.question("enter course id which you\n")
    return course_list[number - 1]

}).then((number) => {
    console.log(".........Welcome in course..........")
    const newUrl = Base_url + "/courses/" + number + "/exercises"
    return axios.get(newUrl).then((response) => {
        const allExercise = response.data.data;
        all_slug = []
        var count = 1;

        for (let i = 0; i < allExercise.length; i++) {
            let exercises = allExercise[i]
            console.log(".................");
            console.log(count, "Exercise:-", exercises.name)
            all_slug.push(exercises.slug);
            count++

            let exercise = exercises.childExercises
            for (let j = 0; j < exercise.length; j++) {
                console.log(count, "   ", exercise[j].name)
                all_slug.push(exercise[j].slug)
                count++
            }

        }
    })
}).then(() => {
    var input = read.question("Enter Your number:- ")
    return input - 1

}).then(async (index) => {
    let slug = all_slug[index]
    console.log(index, '------------------')
    const slug_url = "http://saral.navgurukul.org/api/courses/56/exercise/getBySlug?slug=" + slug;
    const response = await axios.get(slug_url)
6
    console.log(response.data.content)
    var current_index = index
    while (true) {
        var input = read.question("Enter P or N:- ");
        
        if (input == "p" && current_index > 0) {
            const new_slug = all_slug[current_index-1];
             current_index = current_index -1
            console.log(new_slug)
            const url = "http://saral.navgurukul.org/api/courses/56/exercise/getBySlug?slug=" + new_slug;
            const p_g = await axios.get(url)
                console.log(p_g.data.content)
        
        
        }
        else if(input == "n" && current_index < parent_slug.length){
            const new_slug = all_slug[current_index+1];
            current_index = current_index+1
            console.log(new_slug)
            const url_next = "http://saral.navgurukul.org/api/courses/56/exercise/getBySlug?slug=" + new_slug;
            const next_slug = await axios.get(url_next)
                console.log(next_slug.data.content)
        

        }
   
    else{
        console.log("Invalid input");
        console.log("--------------------------------");
        console.log("EXIT......")
        break
    }
    }
    
})