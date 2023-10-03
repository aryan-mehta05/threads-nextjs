"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/modals/user.modal";

interface UpdateUserProps {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUserProps): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      { 
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
  
    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
};