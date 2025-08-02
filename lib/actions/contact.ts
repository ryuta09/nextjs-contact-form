'use server'
import { redirect} from "next/navigation";
import { ContactSchema } from "../validations/contact";
import { z } from "zod";
import { prisma } from '../../lib/prisma'


// ActionStateの型定義
type ActionsState = {
  success: boolean;
  errors: {
    formErrors: string[]; // フォーム全体のエラー
    fieldErrors: { // 各フィールドのエラー
      name?: string[]
      email?: string[]
    }; 
    serverErrors?: string // サーバーエラー
  }
}
export async function submitContactForm(
  prevState: ActionsState,
  formData: FormData): Promise<ActionsState> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string

  // バリデーション
  const validationResult = ContactSchema.safeParse({name, email})

  if(!validationResult.success) {
    const errors = z.flattenError(validationResult.error);
    console.log('バリデーションエラー:', errors);
    return {
      success: false,
      errors: {
        formErrors: [],
        fieldErrors: {
          name: errors.fieldErrors.name || [],
          email: errors.fieldErrors.email || [],
        },
      },
    }
  }
  // DB登録
  // メールアドレスが存在しているかどうか
  const existingRecord = await prisma.contact.findUnique({
    where: {
      email: email
    }
  })

  if(existingRecord) {
    return {
      success: false,
      errors: {
        formErrors: [],
        fieldErrors: {
          name: [],
          email: ['このメールアドレスは既に登録されています。'],
        },
      },
    }
  }

  // データベースに保存
  await prisma.contact.create({
    data: {
      name,
      email
    }
  })

  console.log('送信されたデータ:', { name, email });
  redirect('/contact/complete');
}