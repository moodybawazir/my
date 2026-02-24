
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectRealEstate from './ProjectRealEstate';
import ProjectAI from './ProjectAI';
import ProjectMedical from './ProjectMedical';
import ProjectCafe from './ProjectCafe';
import ProjectEcommerce from './ProjectEcommerce';
import ProjectAccounting from './ProjectAccounting';
import ProjectDynamicFallback from './ProjectDynamicFallback';

const ProjectIndustrySelector: React.FC = () => {
    const { industryId } = useParams<{ industryId: string }>();
    const navigate = useNavigate();

    // Map legacy or alternative slugs to standardized ones
    const slugMap: Record<string, string> = {
        'agencies': 'accounting',
        'accounting-automation': 'accounting',
        'real-estate': 'real-estate',
        'ai-assistant': 'ai-assistant',
        'medical': 'medical',
        'restaurants': 'restaurants',
        'ecommerce': 'ecommerce'
    };

    const effectiveId = slugMap[industryId || ''] || industryId;

    // Route to the appropriate premium design
    switch (effectiveId) {
        case 'real-estate':
            return <ProjectRealEstate />;
        case 'ai-assistant':
            return <ProjectAI />;
        case 'medical':
            return <ProjectMedical />;
        case 'restaurants':
            return <ProjectCafe />;
        case 'ecommerce':
            return <ProjectEcommerce />;
        case 'accounting':
            return <ProjectAccounting />;
        default:
            // For new industries, use the DynamicFallback component
            return <ProjectDynamicFallback />;
    }
};

export default ProjectIndustrySelector;
