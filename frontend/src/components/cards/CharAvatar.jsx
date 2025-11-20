import React from 'react'
import { getInitials } from '../../utils/helper';
const CharAvatar = ({fullName,width,heiht,style}) => {
  return <div className={`${width || 'w-12'} ${heiht || 'h-12'}${style || ''} flex items-center rounded-full text-gray-900 font-medium bg-gray-100  `}>
    {getInitials(fullName||"")}
  </div>
}

export default CharAvatar