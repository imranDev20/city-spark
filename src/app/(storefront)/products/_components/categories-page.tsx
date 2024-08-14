import React from 'react'
import CategoriesNavigation from './categories-navigation'
import { getNavigationCategories } from '@/app/admin/categories/actions'
export type NavigationType = {
  id: string;
  name: string;
  primaryChildCategories: {
    id: string;
    name: string;
    secondaryChildCategories: {
      id: string;
      name: string;
      tertiaryChildCategories: {
        id: string;
        name: string;
      }[];
    }[];
  }[];
}[];

export default async function CategoriesNavigationPage() {
const  categories = await getNavigationCategories();
console.log(`categories`, categories);

const navigationList = categories?.map(primary => {
return {
  id: primary.id,
  name: primary.name,
  primaryChildCategories: primary?.primaryChildCategories?.map(secondary =>{
    return {
      id: secondary.id,
      name: secondary.name,
      secondaryChildCategories: secondary?.secondaryChildCategories?.map(tertiary => {
        return {
          id: tertiary.id,
          name: tertiary.name,
          tertiaryChildCategories : tertiary?.tertiaryChildCategories?.map(quaternary => {
            return {
              id: quaternary.id,
              name: quaternary.name
              
            }
          })
        }
      })
    }
  })
}
});
console.log(`navigationList`, navigationList);
  return (
    <CategoriesNavigation navigationList={navigationList} />
  )
}
