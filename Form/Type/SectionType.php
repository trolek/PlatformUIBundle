<?php
/**
 * File containing the SectionType class.
 *
 * @copyright Copyright (C) eZ Systems AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 * @version //autogentag//
 */

namespace EzSystems\PlatformUIBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Translation\TranslatorInterface;

class SectionType extends AbstractType
{
    /**
     * @var \Symfony\Component\Translation\TranslatorInterface
     */
    private $translator;

    public function __construct( TranslatorInterface $translator )
    {
        $this->translator = $translator;
    }

    public function buildForm( FormBuilderInterface $builder, array $options )
    {
        $submitLabel = $this->translator->trans(
            'section.create.submit',
            array(),
            'section'
        );

        $builder
            ->add( 'name', 'text' )
            ->add( 'identifier', 'text' )
            ->add( 'save', 'submit', array( 'label' => $submitLabel ) );
    }

    public function getName()
    {
        return 'section';
    }

    public function setDefaultOptions( OptionsResolverInterface $resolver )
    {
        $resolver->setDefaults(
            array( 'data_class' => 'EzSystems\PlatformUIBundle\Entity\Section' )
        );
    }
}
