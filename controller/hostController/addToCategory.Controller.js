import asyncHandler from "../../utils/asyncHandler.js";
import { RPMGroup } from '../../models/RPMGroup.model.js'
import Category from "../../models/categorie.model.js";
import ApiError from "../../utils/ApiError.js";

const getAddCaategoryPage = asyncHandler(async (req, res) => {
    res.render('Admin.Dashbord/categoryadd', {
        layout: false,
        title: 'admin-categoryadd',
        page: "admin-categoryadd",
        showGroup: req.showGroup
    })
})


const groutRpm = asyncHandler(async (req, res, next) => {

    // const topicsName = await Category.find().select("name")
    // console.log("topicsName", topicsName);

    const showGroup = await RPMGroup.find().lean()
    console.log("showGroup", showGroup);

    req.showGroup = showGroup


    //    console.log("  req.showGroup",   req.showGroup);

    next()


})

const addCategory = asyncHandler(async (req, res) => {
    console.log("req.body", req.body);

    const { name, topics } = req.body;
    console.log("name", name);
    console.log("topics", topics);
    console.log("topics", typeof topics);
    
    const trimName = name.trim();

    // const RPMGroup = await RPMGroup.dind
    let category = await Category.findOne({ name: trimName });
    const rpm = await RPMGroup.findById(topics[0].rpm_group_id)
    console.log("rpm", rpm);
    
     if (!rpm) {
        throw new ApiError("this RPM id does not exist", 400);
        
  
     }

    if (!category) {
        category = await Category.create({
            name: trimName,
            topics: []
        });
    }

    // Check duplicates
    const duplicateTopic = topics.some(topic =>
        category.topics.some(existTopic =>
            existTopic.title === topic.title || existTopic.slug === topic.slug
        )
    );

    if (!duplicateTopic) {
        topics.forEach(topic => {
            category.topics.push({
                title : topic.title,
                slug : topic.slug,
                rpm_group_id : topic.rpm_group_id
            })
        });
    }



    await category.save();

    res.render('Admin.Dashbord/categoryadd', {
        layout: false,
        title: 'admin-categoryadd',
        page: "admin-categoryadd",
        showGroup: req.showGroup
    });
});


export {
    getAddCaategoryPage,
    groutRpm,
    addCategory
} 