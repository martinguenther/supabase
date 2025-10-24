import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'

import { useParams } from 'common'
import { useVectorBucketDeleteMutation } from 'data/storage/vector-bucket-delete-mutation'
import bucket from 'icons/src/icons/bucket'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSection,
  DialogSectionSeparator,
  DialogTitle,
  Form_Shadcn_,
  FormControl_Shadcn_,
  FormField_Shadcn_,
  Input_Shadcn_,
} from 'ui'
import { Admonition } from 'ui-patterns'
import { FormItemLayout } from 'ui-patterns/form/FormItemLayout/FormItemLayout'

export interface DeleteVectorBucketModalProps {
  visible: boolean
  bucketName: string
  onCancel: () => void
  onSuccess: () => void
}

const formId = `delete-storage-vector-bucket-form`

export const DeleteVectorBucketModal = ({
  visible,
  bucketName,
  onCancel,
  onSuccess,
}: DeleteVectorBucketModalProps) => {
  const { ref: projectRef } = useParams()

  const schema = z.object({
    confirm: z.literal(bucketName, {
      errorMap: () => ({ message: `Please enter "${bucketName}" to confirm` }),
    }),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const { mutate: deleteBucket, isLoading } = useVectorBucketDeleteMutation({
    onSuccess: async () => {
      onSuccess()
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async () => {
    if (!projectRef) return console.error('Project ref is required')
    if (!bucket) return console.error('No bucket is selected')

    deleteBucket({ projectRef, bucketName })
  }

  return (
    <Dialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) onCancel()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm deletion of {bucket.name}</DialogTitle>
        </DialogHeader>

        <DialogSectionSeparator />

        <Admonition
          type="destructive"
          className="rounded-none border-x-0 border-t-0 mb-0"
          title="You cannot recover this bucket once deleted."
          description="All bucket data will be lost."
        />

        <DialogSection>
          <p className="text-sm">
            Your bucket <span className="font-bold text-foreground">{bucketName}</span> and all its
            contents will be permanently deleted.
          </p>
        </DialogSection>
        <DialogSectionSeparator />
        <DialogSection>
          <Form_Shadcn_ {...form}>
            <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
              <FormField_Shadcn_
                key="confirm"
                name="confirm"
                control={form.control}
                render={({ field }) => (
                  <FormItemLayout
                    name="confirm"
                    label={
                      <>
                        Type <span className="font-bold text-foreground">{bucketName}</span> to
                        confirm.
                      </>
                    }
                  >
                    <FormControl_Shadcn_>
                      <Input_Shadcn_
                        id="confirm"
                        autoComplete="off"
                        {...field}
                        placeholder="Type bucket name"
                      />
                    </FormControl_Shadcn_>
                  </FormItemLayout>
                )}
              />
            </form>
          </Form_Shadcn_>
        </DialogSection>
        <DialogFooter>
          <Button type="default" disabled={isLoading} onClick={onCancel}>
            Cancel
          </Button>
          <Button form={formId} htmlType="submit" type="danger" loading={isLoading}>
            Delete bucket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
