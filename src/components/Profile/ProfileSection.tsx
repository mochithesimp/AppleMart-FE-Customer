import { motion } from 'framer-motion';
import React, { ComponentType, ReactNode } from 'react'
import './ProfileSection.css'

interface IconProps {
	className?: string;
	size?: number;
}

interface ProfileProps {
	icon: ComponentType<IconProps>; 
	title: string;
	children: ReactNode;
}
const ProfileSection : React.FC<ProfileProps> = ({ icon: Icon, title, children }) => {
  return (
    <motion.div
			className="profilesection-container"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="profilesection-header">
				<Icon className="profilesection-icon" size={24} />
				<h2 className="profilesection-title">{title}</h2>
			</div>
			<div className="profilesection-description">{children}</div>
	</motion.div>
  )
}

export default ProfileSection