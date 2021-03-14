import React from 'react'
import PetBox from './PetBox'

export default function PetsList({pets,deletePet}) {
  return (
    <div className="row">
      {pets.map(pet => (
        <div className="col-xs-12 col-md-4 col" key={pet.id}>
          <div className="box">
            <PetBox pet={pet} />
            <button className="red-btn" value={pet.id} onClick={e => deletePet({
              variables:{id:`${e.target.value}`}
            })}>My Pet is missing :( so delete from database </button>
          </div>
        </div>
      ))}
    </div>
  )
}

PetsList.defaultProps = {
  pets: []
}
