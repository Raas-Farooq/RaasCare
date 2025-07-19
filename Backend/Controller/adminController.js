import Admin from '../models/admin.js';

const superAdmin = async(req, res) => {
    const hashedPassword = await bcrypt.hash('aga@3344', 10);
    try{
        const superAdmin = await Admin.insertOne({
        name:'Aga Ali',
        email:"aga@gmail.com",
        password:hashedPassword,
        role:'admin',
        permissions:
            [
            'manage_patients', 
            "manage_doctors",
            "view_reports",
            "system_settings"
            ]
         })

         return res.status(201).json({
            success:true,
            message:"Added Super Admin",
            superAdmin,
         })
    }
    catch(err){
        return res.status("500").json({
            success:false,
            message:"error while assigning first User",
            error:err.message
        })
    }
}

export {superAdmin}