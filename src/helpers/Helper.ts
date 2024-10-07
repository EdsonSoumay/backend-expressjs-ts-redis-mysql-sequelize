import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface UserData  {
	name: string | null
	email: string | null
	roleId: string | null
	verified: boolean | null
	active:boolean | null
}

const GenerateToken = (data: any): string => {
	const token = jwt.sign(data, process.env.JWT_TOKEN as string, { expiresIn: "1d" });
	return token;
}

const GenerateRefreshToken = (data: any): string => {
	const token = jwt.sign(data, process.env.JWT_REFRESH_TOKEN as string, { expiresIn: "2d" });
	return token;
}

const ExtractToken = (token: string): UserData | null => {
	const secretKey: string = process.env.JWT_TOKEN as string;

	let resData: any;

	const res = jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			resData = null
		} else {
			resData = decoded
		}
	});

	if (resData) {
		const result: UserData = <UserData>(resData);
		return result;
	}
	return null;
}

const ExtractRefreshToken = (token: string): UserData | null => {
	const secretKey: string = process.env.JWT_REFRESH_TOKEN as string;

	let resData: any;

	const res = jwt.verify(token, secretKey, (err, decoded) => {
		if (err) {
			resData = null
		} else {
			resData = decoded
		}
	});

	if (resData) {
		const result: UserData = <UserData>(resData);
		return result;
	}
	return null;
}


export default { GenerateToken, GenerateRefreshToken, ExtractToken, ExtractRefreshToken };