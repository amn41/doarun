import React from 'react'
import { Story, Meta} from '@storybook/react'
import {AppHeader} from './index'

export default {
  title: 'App Header',
  component: AppHeader,
} as Meta

const Template: Story = (args) => <AppHeader {...args} />

export const Default = Template.bind({})
Default.args = {}