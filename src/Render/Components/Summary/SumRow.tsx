import React from 'react';


interface Props {
  data: string[]
  // can pass the index here
}

function SumRow(Props: Props) {
  return (
      Props.data.map((cell, index) => (
        <div key={index}>
          <p className="summaryCell">
            {cell}
          </p>
        </div>
      ))
  )
}