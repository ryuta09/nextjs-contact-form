import { getContact, getContacts } from "@/lib/contact"

export default async function contactList() {
  const contacts = await getContacts()
  const first = await getContact('1')

  return (
    <>
      <ul>
        {
          contacts.map((contact) => (
            <li key={contact.id}>
              {contact.name} : {contact.email}
            </li>
          ))
        }
      </ul>
      <div>
        {first ? first.name : '登録されていません。'}
        {first ? first.email : ''}
      </div>
    </>
  )
}