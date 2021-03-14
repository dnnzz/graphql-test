import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const PETS_FIELDS = gql`
  fragment PetsFields on Pet{
    id
    name
    type
    img
    vaccinated @client
    owner{
      id
    }
  }
`
const DELETE_PET  =gql`
 mutation DeleteAPet($id: ID!){
   deletePet(id: $id){
     id
   }
 }
`

const ALL_PETS = gql`
  query Pets {
    pets { 
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`
const CREATE_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!){
  addPet(input: $newPet){
    ...PetsFields
    }
  }
  ${PETS_FIELDS}
`
export default function Pets () {
  const [modal, setModal] = useState(false)
  const {data,loading,error} = useQuery(ALL_PETS);
  // addPet exactly the same as mutation that we created before.
  const [createPet,newPet] = useMutation(CREATE_PET, {
    update(cache,{data:{addPet}}){
      const {pets} = cache.readQuery({query: ALL_PETS});
      cache.writeQuery({
        query:ALL_PETS,
        data:{pets: [addPet,...pets]}
      })
    }
  });
  const [deletePet ,deleteAPet] = useMutation(DELETE_PET, {
    update(cache,{data:{DeleteAPet}}){
      const {pets} = cache.readQuery({query:ALL_PETS});
      cache.writeQuery({
        query:ALL_PETS,
        data:{pets:[...pets]}
      })
    }
  })
  const onSubmit = input => {
    setModal(false)
    createPet({
      variables:{newPet : input },
      optimisticResponse:{
        __typename:"Mutation",
        addPet: {
          __typename:"Pet",
          id: Math.floor(Math.random()*1000) + "",
          name: input.name,
          type: input.type,
          img: "https://via.placeholder.com/300"
        }
      }
    })
  }
  if(loading || newPet.loading){
    return <Loader />
  }
  if(error || newPet.error){
    return <p>Error!</p>
  }
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList deletePet={deletePet} pets={data.pets} />
      </section>
    </div>
  )
}
