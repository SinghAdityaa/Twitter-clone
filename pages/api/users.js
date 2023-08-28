import mongoose from "mongoose";
import {initMongoose} from "../../lib/mongoose";
import User from "../../models/User";
import {getServerSession} from "next-auth";
import {authOptions} from "./auth/[...nextauth]";
import Follower from "../../models/Follower";

export default async function handle(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);

  console.log(session.user)

  if (req.method === 'PUT') {
    const {username} = req.body;
    await User.findByIdAndUpdate(session.user._id, {username});
    res.json('ok');
  }
  if (req.method === 'GET') {
    const {id,username} = req.query;
    const user = id
      ? await User.findById(id)
      : await User.findOne({username});
    const follow = await Follower.findOne({
      source:session.user._id,
      destination:user._id
    });
    res.json({user,follow});
  }

}