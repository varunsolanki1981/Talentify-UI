import { Component } from '@angular/core';

@Component({
  selector: 'app-board-of-trustees',
  standalone: false,
  templateUrl: './board-of-trustees.html',
  styleUrl: './board-of-trustees.css',
})
export class BoardOfTrustees {

  trustees = [
    {
      name: 'Mr. Nitin Jain',
      role: 'Chairperson',
      description: 'Nitin, a champion for child rights and humanitarian response, is leading program implementation at Bal Raksha Bharat including evaluation, and technical support, multi-sectoral program development & humanitarian response for almost two decades across various themes. He demonstrates the capacity to secure access, undertake longer-term association with CSOs and develop evidence-based strategies on various issues affecting the lives of most marginalized children and their families in some of the most challenging contexts.',
      image: 'assets/images/Varun.jpg'
    },
    {
      name: 'Mr. Raj Mehta',
      role: 'Vice Chairperson',
      description: 'Raj, a dedicated professional with extensive experience in social development and community engagement, is actively involved in shaping strategic initiatives at Bal Raksha Bharat. His work focuses on creating sustainable impact through collaborative efforts and evidence-based approaches across various sectors.',
      image: 'assets/images/Yuvaraj.jpg'
    },
    {
      name: 'Ms. Neha Patel',
      role: 'Trustee - Health Programs',
      description: 'Nitin, a champion for child rights and humanitarian response, is leading program implementation at Bal Raksha Bharat including evaluation, and technical support, multi-sectoral program development & humanitarian response for almost two decades across various themes. He demonstrates the capacity to secure access, undertake longer-term association with CSOs and develop evidence-based strategies on various issues affecting the lives of most marginalized children and their families in some of the most challenging contexts.',
      image: 'assets/images/Varun.jpg'
    },
    {
      name: 'Mr. Vikram Singh',
      role: 'Trustee - Education',
      description: 'Nitin, a champion for child rights and humanitarian response, is leading program implementation at Bal Raksha Bharat including evaluation, and technical support, multi-sectoral program development & humanitarian response for almost two decades across various themes. He demonstrates the capacity to secure access, undertake longer-term association with CSOs and develop evidence-based strategies on various issues affecting the lives of most marginalized children and their families in some of the most challenging contexts.',
       image: 'assets/images/Yuvaraj.jpg'
    }
  ];
}

