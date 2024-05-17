import Role from "../models/Role.js";
import UserModel from "../models/User.js";
// Add Role
export const addRole=async(req,res)=>{
try {
    const {name,permissions}=req.body;
    if(!name){
        return res.status(400).json({success:false,message:"Name Field is required"})
    }
    if(!permissions){
        return res.status(400).json({success:false,message:"Role Field is required"})
    }
const newRole=new Role({
    name,
    permissions
})
const saveNewRole=await newRole.save();
 // Return the newly created role in the response
 res.status(201).json({ success: true, message: 'Role created successfully', role: saveNewRole });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
}
}
// Get Roles
export const getRoles = async (req, res) => {
  try {
    // Fetch all roles from the database
    const roles = await Role.find();
    // Return the roles in the response
    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
// Delete Role
export const deleteRole = async (req, res) => {
    try {
      const roleId = req.params.id;
      const deletedRole = await Role.findByIdAndDelete(roleId);
      if (deletedRole) {
        res.status(200).json({ success: true, message: 'Role deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Role not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  // Update Role
export const updateRole = async (req, res) => {
    try {
      const roleId = req.params.id;
      const { name, permissions } = req.body;
      const updatedRole = await Role.findByIdAndUpdate(roleId, { name, permissions }, { new: true });
      if (updatedRole) {
        res.status(200).json({ success: true, message: 'Role updated successfully', role: updatedRole });
      } else {
        res.status(404).json({ success: false, message: 'Role not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };




