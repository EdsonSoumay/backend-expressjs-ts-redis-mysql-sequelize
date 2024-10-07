import User, { UserAttributes } from "../db/models/User";

const getUserService = async (id: string) => {
    const user = await User.findOne({where: { id }});
    return user;
}

const updateUserService = async (id: string, value: UserAttributes) => {
    const { username, email } = value;
    const user = await User.update({username, email}, { where: { id } });
    return user;
};

const deleteUserService = async (id:string)=>{
    const user = await User.destroy({ where: { id } });
    return user;
}

export  { getUserService, updateUserService, deleteUserService}