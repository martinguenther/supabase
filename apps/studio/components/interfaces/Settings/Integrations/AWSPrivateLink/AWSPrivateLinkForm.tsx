import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Button,
  FormControl_Shadcn_,
  FormField_Shadcn_,
  Form_Shadcn_,
  SheetDescription,
  SheetSection,
  Badge,
  Input_Shadcn_,
  Card,
  CardContent,
} from 'ui'
import { useForm } from 'react-hook-form'
import { FormItemLayout } from 'ui-patterns/form/FormItemLayout/FormItemLayout'
import type { AWSAccount } from 'data/aws-accounts/aws-accounts-query'
import { useAWSAccountCreateMutation } from 'data/aws-accounts/aws-account-create-mutation'
import { useSelectedProjectQuery } from 'hooks/misc/useSelectedProject'

interface AWSPrivateLinkFormProps {
  account?: AWSAccount
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormValues {
  awsAccountId: string
  accountName: string
}

const AWSPrivateLinkForm = ({ account, open, onOpenChange }: AWSPrivateLinkFormProps) => {
  const isNew = !account
  const { data: project } = useSelectedProjectQuery()
  const { mutate: createAccount } = useAWSAccountCreateMutation()

  const form = useForm<FormValues>({
    defaultValues: {
      awsAccountId: account?.aws_account_id ?? '',
      accountName: account?.account_name ?? '',
    },
  })

  const onSubmit = (values: FormValues) => {
    if (!project) return
    if (isNew) {
      createAccount(
        {
          projectRef: project.ref,
          awsAccountId: values.awsAccountId,
          accountName: values.accountName,
        },
        { onSuccess: () => onOpenChange(false) }
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0">
        <SheetHeader>
          <SheetTitle>{isNew ? 'Add AWS Account' : 'AWS Account Details'}</SheetTitle>
          <SheetDescription>
            Connect to your Supabase project from your AWS VPC using AWS PrivateLink.
          </SheetDescription>
        </SheetHeader>
        <Form_Shadcn_ {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
            <SheetSection className="space-y-4 flex-1">
              {!isNew && account && (
                <Card className="mb-6">
                  <CardContent className="flex items-center gap-2">
                    <p className="text-sm flex-1">
                      {account.status === 'ASSOCIATION_ACCEPTED'
                        ? 'This account has been accepted by the AWS account owner.'
                        : account.status === 'READY'
                        ? 'This account is ready to be accepted by the AWS account owner.'
                        : account.status === 'CREATING'
                        ? 'This account is being created.'
                        : 'This account needs to be accepted by the AWS account owner.'}
                    </p>
                    <Badge 
                      variant={
                        account.status === 'ASSOCIATION_ACCEPTED' 
                          ? 'success' 
                          : account.status === 'READY'
                          ? 'success'
                          : account.status === 'CREATING'
                          ? 'warning'
                          : account.status === 'CREATION_FAILED' || account.status === 'ASSOCIATION_REQUEST_EXPIRED'
                          ? 'destructive'
                          : 'warning'
                      }
                    >
                      {account.status === 'ASSOCIATION_ACCEPTED' 
                        ? 'Connected'
                        : account.status === 'READY'
                        ? 'Ready'
                        : account.status === 'CREATING'
                        ? 'Creating'
                        : account.status === 'CREATION_FAILED'
                        ? 'Failed'
                        : account.status === 'ASSOCIATION_REQUEST_EXPIRED'
                        ? 'Expired'
                        : account.status === 'DELETING'
                        ? 'Deleting'
                        : 'Unknown'
                      }
                    </Badge>
                  </CardContent>
                </Card>
              )}
              <FormField_Shadcn_
                control={form.control}
                name="awsAccountId"
                render={({ field }) => (
                  <FormItemLayout
                    label="AWS Account ID"
                    description="The ID of the AWS account you want to connect to."
                  >
                    <FormControl_Shadcn_>
                      <Input_Shadcn_ {...field} />
                    </FormControl_Shadcn_>
                  </FormItemLayout>
                )}
              />
              <FormField_Shadcn_
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItemLayout label="Account Name" description="A name for this account connection.">
                    <FormControl_Shadcn_>
                      <Input_Shadcn_ {...field} />
                    </FormControl_Shadcn_>
                  </FormItemLayout>
                )}
              />
            </SheetSection>

            <SheetFooter>
              <Button type="default" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {isNew && <Button htmlType="submit">Add Account</Button>}
            </SheetFooter>
          </form>
        </Form_Shadcn_>
      </SheetContent>
    </Sheet>
  )
}

export default AWSPrivateLinkForm
