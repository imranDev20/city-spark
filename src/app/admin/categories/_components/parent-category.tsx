import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'


export default function ParentCategory(props:any) {
  return (
    <Card>
              <CardHeader>
                <CardTitle>Parent Category</CardTitle>
                <CardDescription>
                  Select the parent category if applicable.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <FormField
                    // control={control}
                    name="parentCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">
                              Secondary
                            </SelectItem>
                            <SelectItem value="tertiary">Tertiary</SelectItem>
                            <SelectItem value="quaternary">
                              Quaternary
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
  )
}
